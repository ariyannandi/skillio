import { db } from '$lib/server/db';
import { skills, userSkills } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/auth');

	const allSkills = await db.select().from(skills);

	const enrolled = await db
		.select({ skillId: userSkills.skillId })
		.from(userSkills)
		.where(eq(userSkills.userId, locals.user.id));

	const enrolledIds = new Set(enrolled.map((e) => e.skillId));

	return {
		skills: allSkills.map((s) => ({
			...s,
			enrolled: enrolledIds.has(s.id)
		}))
	};
};

export const actions: Actions = {
	enrol: async ({ request, locals }) => {
		if (!locals.user) redirect(302, '/auth');

		const data = await request.formData();
		const skillId = data.get('skillId') as string;
		if (!skillId) return fail(400, { message: 'Missing skillId' });

		await db.insert(userSkills).values({
			userId: locals.user.id,
			skillId
		});

		return { success: true };
	}
};
