import { db } from '$lib/server/db';
import { flashcards, reviewLog, userSkills } from '$lib/server/db/schema';
import { eq, and, lte, sql } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/demo/better-auth');

	const now = new Date();

	const dueReviewed = await db
		.select({
			id: flashcards.id,
			front: flashcards.front,
			back: flashcards.back,
			skillId: flashcards.skillId,
			ease: reviewLog.ease,
			interval: reviewLog.interval
		})
		.from(reviewLog)
		.innerJoin(flashcards, eq(reviewLog.flashcardId, flashcards.id))
		.where(and(eq(reviewLog.userId, locals.user.id), lte(reviewLog.nextReviewAt, now)));

	const enrolled = await db
		.select({ skillId: userSkills.skillId })
		.from(userSkills)
		.where(eq(userSkills.userId, locals.user.id));

	const enrolledIds = enrolled.map((e) => e.skillId);

	const reviewedIds = await db
		.select({ flashcardId: reviewLog.flashcardId })
		.from(reviewLog)
		.where(eq(reviewLog.userId, locals.user.id));

	const reviewedSet = new Set(reviewedIds.map((r) => r.flashcardId));

	let newCards: typeof dueReviewed = [];

	if (enrolledIds.length > 0) {
		const allEnrolledCards = await db
			.select({
				id: flashcards.id,
				front: flashcards.front,
				back: flashcards.back,
				skillId: flashcards.skillId,
				ease: sql<number>`2.5`,
				interval: sql<number>`1`
			})
			.from(flashcards)
			.where(
				sql`${flashcards.skillId} = ANY(ARRAY[${sql.join(
					enrolledIds.map((id) => sql`${id}`),
					sql`, `
				)}]::text[])`
			);

		newCards = allEnrolledCards.filter((c) => !reviewedSet.has(c.id)).slice(0, 10);
	}

	const queue = [...dueReviewed, ...newCards];
	return { queue };
};

export const actions: Actions = {
	review: async ({ request, locals }) => {
		if (!locals.user) redirect(302, '/demo/better-auth');

		const data = await request.formData();
		const flashcardId = data.get('flashcardId') as string;
		const rating = parseInt(data.get('rating') as string);
		const ease = parseFloat(data.get('ease') as string);
		const interval = parseInt(data.get('interval') as string);

		if (!flashcardId || isNaN(rating)) return fail(400, { message: 'Invalid data' });

		const newEase = Math.max(1.3, ease + 0.1 - (4 - rating) * (0.08 + (4 - rating) * 0.02));
		let newInterval: number;

		if (rating < 2) {
			newInterval = 1;
		} else if (interval <= 1) {
			newInterval = 1;
		} else if (interval === 1) {
			newInterval = 6;
		} else {
			newInterval = Math.round(interval * newEase);
		}

		const nextReviewAt = new Date();
		nextReviewAt.setDate(nextReviewAt.getDate() + newInterval);

		await db.insert(reviewLog).values({
			userId: locals.user.id,
			flashcardId,
			rating,
			ease: newEase,
			interval: newInterval,
			nextReviewAt,
			reviewedAt: new Date()
		});

		const xpMap: Record<number, number> = { 1: 0, 2: 5, 3: 10, 4: 15 };
		const xpGained = xpMap[rating] ?? 0;

		if (xpGained > 0) {
			const card = await db.query.flashcards.findFirst({
				where: eq(flashcards.id, flashcardId)
			});

			if (card) {
				await db
					.update(userSkills)
					.set({ xp: sql`${userSkills.xp} + ${xpGained}` })
					.where(and(eq(userSkills.userId, locals.user.id), eq(userSkills.skillId, card.skillId)));
			}
		}

		return { success: true, xpGained };
	}
};
