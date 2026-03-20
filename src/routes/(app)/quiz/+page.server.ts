import { db } from '$lib/server/db';
import { userSkills } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/auth');

	const enrolled = await db.query.userSkills.findMany({
		where: eq(userSkills.userId, locals.user.id),
		with: { skill: true }
	});

	return { enrolled };
};
