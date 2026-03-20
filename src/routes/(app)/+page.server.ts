import { db } from '$lib/server/db';
import { userSkills, reviewLog } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { eq, and, gte, lte, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/auth');

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// enrolled skills count
	const enrolled = await db
		.select({ count: sql<number>`count(*)` })
		.from(userSkills)
		.where(eq(userSkills.userId, locals.user.id));

	// cards reviewed today
	const reviewedToday = await db
		.select({ count: sql<number>`count(*)` })
		.from(reviewLog)
		.where(and(eq(reviewLog.userId, locals.user.id), gte(reviewLog.reviewedAt, today)));

	// total cards reviewed all time
	const totalReviewed = await db
		.select({ count: sql<number>`count(*)` })
		.from(reviewLog)
		.where(eq(reviewLog.userId, locals.user.id));

	// cards due right now
	const now = new Date();
	const dueCards = await db
		.select({ count: sql<number>`count(*)` })
		.from(reviewLog)
		.where(and(eq(reviewLog.userId, locals.user.id), lte(reviewLog.nextReviewAt, now)));
	// recently enrolled skills with names
	const recentSkills = await db.query.userSkills.findMany({
		where: eq(userSkills.userId, locals.user.id),
		with: { skill: true },
		limit: 3
	});

	const streakData = await db
		.select({ streak: userSkills.streak, skillId: userSkills.skillId })
		.from(userSkills)
		.where(eq(userSkills.userId, locals.user.id));

	const bestStreak = streakData.reduce((max, s) => Math.max(max, s.streak), 0);

	return {
		user: locals.user,
		stats: {
			enrolledCount: Number(enrolled[0].count),
			reviewedToday: Number(reviewedToday[0].count),
			totalReviewed: Number(totalReviewed[0].count),
			dueNow: Number(dueCards[0].count),
			bestStreak
		},
		recentSkills
	};
};
