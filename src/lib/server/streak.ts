import { db } from '$lib/server/db';
import { userSkills } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export async function updateStreak(userId: string, skillId: string): Promise<number> {
	const us = await db.query.userSkills.findFirst({
		where: and(eq(userSkills.userId, userId), eq(userSkills.skillId, skillId))
	});

	if (!us) return 0;

	const now = new Date();
	const todayStart = new Date(now);
	todayStart.setHours(0, 0, 0, 0);

	const yesterdayStart = new Date(todayStart);
	yesterdayStart.setDate(yesterdayStart.getDate() - 1);

	const lastStudied = us.lastStudiedAt;

	let newStreak = us.streak;

	if (!lastStudied) {
		// first time studying
		newStreak = 1;
	} else if (lastStudied >= todayStart) {
		// already studied today — don't change streak
		return us.streak;
	} else if (lastStudied >= yesterdayStart) {
		// studied yesterday — increment
		newStreak = us.streak + 1;
	} else {
		// missed a day — reset
		newStreak = 1;
	}

	await db
		.update(userSkills)
		.set({
			streak: newStreak,
			lastStudiedAt: now
		})
		.where(and(eq(userSkills.userId, userId), eq(userSkills.skillId, skillId)));

	return newStreak;
}
