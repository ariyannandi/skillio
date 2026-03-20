import { db } from '$lib/server/db';
import { userSkills, reviewLog, flashcards } from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/auth/login');

	const enrolledSkills = await db
		.select({ count: sql<number>`count(*)` })
		.from(userSkills)
		.where(eq(userSkills.userId, locals.user.id));

	const totalReviews = await db
		.select({ count: sql<number>`count(*)` })
		.from(reviewLog)
		.where(eq(reviewLog.userId, locals.user.id));

	const totalXp = await db
		.select({ total: sql<number>`sum(xp)` })
		.from(userSkills)
		.where(eq(userSkills.userId, locals.user.id));

	const streakData = await db
		.select({ streak: userSkills.streak })
		.from(userSkills)
		.where(eq(userSkills.userId, locals.user.id));

	const bestStreak = streakData.reduce((max, s) => Math.max(max, s.streak), 0);

	return {
		user: locals.user,
		stats: {
			enrolledSkills: Number(enrolledSkills[0].count),
			totalReviews: Number(totalReviews[0].count),
			totalXp: Number(totalXp[0].total ?? 0),
			bestStreak
		}
	};
};

export const actions: Actions = {
	updateName: async ({ request, locals }) => {
		if (!locals.user) redirect(302, '/auth/login');

		const data = await request.formData();
		const name = data.get('name')?.toString().trim();

		if (!name || name.length < 2) {
			return fail(400, { nameError: 'Name must be at least 2 characters' });
		}

		try {
			await auth.api.updateUser({
				body: { name },
				headers: request.headers
			});
			return { nameSuccess: true };
		} catch (e) {
			if (e instanceof APIError) {
				return fail(400, { nameError: e.message });
			}
			return fail(500, { nameError: 'Failed to update name' });
		}
	},

	updatePassword: async ({ request, locals }) => {
		if (!locals.user) redirect(302, '/auth/login');

		const data = await request.formData();
		const currentPassword = data.get('currentPassword')?.toString();
		const newPassword = data.get('newPassword')?.toString();
		const confirmPassword = data.get('confirmPassword')?.toString();

		if (!currentPassword || !newPassword || !confirmPassword) {
			return fail(400, { passwordError: 'All fields are required' });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { passwordError: 'New passwords do not match' });
		}

		if (newPassword.length < 8) {
			return fail(400, { passwordError: 'Password must be at least 8 characters' });
		}

		try {
			await auth.api.changePassword({
				body: { currentPassword, newPassword, revokeOtherSessions: false },
				headers: request.headers
			});
			return { passwordSuccess: true };
		} catch (e) {
			if (e instanceof APIError) {
				return fail(400, { passwordError: e.message });
			}
			return fail(500, { passwordError: 'Failed to update password' });
		}
	}
};
