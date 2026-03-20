import { db } from '$lib/server/db';
import { skills, flashcards, userSkills } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error, redirect, fail } from '@sveltejs/kit';
import { generateFlashcards } from '$lib/server/gemini';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) redirect(302, '/auth');

	const skill = await db.query.skills.findFirst({
		where: eq(skills.id, params.id)
	});

	if (!skill) error(404, 'Skill not found');

	const enrolled = await db.query.userSkills.findFirst({
		where: and(eq(userSkills.userId, locals.user.id), eq(userSkills.skillId, params.id))
	});

	const cards = await db.select().from(flashcards).where(eq(flashcards.skillId, params.id));

	return { skill, enrolled: !!enrolled, flashcards: cards };
};

export const actions: Actions = {
	generate: async ({ params, locals }) => {
		if (!locals.user) redirect(302, '/auth');

		const skill = await db.query.skills.findFirst({
			where: eq(skills.id, params.id)
		});

		if (!skill) return fail(404, { message: 'Skill not found' });

		try {
			const cards = await generateFlashcards(skill.name, skill.name, 5);

			await db.insert(flashcards).values(
				cards.map((c) => ({
					skillId: params.id,
					front: c.front,
					back: c.back
				}))
			);

			return { success: true };
		} catch (e) {
			console.error('Gemini error:', e);
			return fail(500, { message: 'Failed to generate flashcards' });
		}
	}
};
