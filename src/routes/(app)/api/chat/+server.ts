import { streamExplanation } from '$lib/server/gemini';
import { db } from '$lib/server/db';
import { skills } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) redirect(302, '/auth/login');

	const { question, history, skillId } = await request.json();

	if (!question?.trim()) error(400, 'Question is required');
	if (!skillId) error(400, 'skillId is required');

	const skill = await db.query.skills.findFirst({
		where: eq(skills.id, skillId)
	});

	if (!skill) error(404, 'Skill not found');

	const stream = await streamExplanation(skill.name, question, history ?? []);

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'X-Content-Type-Options': 'nosniff'
		}
	});
};
