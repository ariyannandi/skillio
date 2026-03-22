import { db } from '$lib/server/db';
import { skills } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import { generateQuizBatch } from '$lib/server/gemini';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) redirect(302, '/auth');

	const skill = await db.query.skills.findFirst({
		where: eq(skills.id, params.skillid)
	});

	if (!skill) error(404, 'Skill not found');

	const questions = await generateQuizBatch(skill.name, skill.name, 5);

	return { skill, questions };
};
