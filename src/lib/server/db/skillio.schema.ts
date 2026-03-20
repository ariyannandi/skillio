import { pgTable, text, integer, timestamp, real } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth.schema';

export const skills = pgTable('skills', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	description: text('description'),
	category: text('category').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const userSkills = pgTable('user_skills', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	skillId: text('skill_id')
		.notNull()
		.references(() => skills.id, { onDelete: 'cascade' }),
	enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),
	xp: integer('xp').default(0).notNull(),
	streak: integer('streak').default(0).notNull(),
	lastStudiedAt: timestamp('last_studied_at')
});

export const flashcards = pgTable('flashcards', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	skillId: text('skill_id')
		.notNull()
		.references(() => skills.id, { onDelete: 'cascade' }),
	front: text('front').notNull(),
	back: text('back').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const reviewLog = pgTable('review_log', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	flashcardId: text('flashcard_id')
		.notNull()
		.references(() => flashcards.id, { onDelete: 'cascade' }),
	rating: integer('rating').notNull(), // 1=forgot 2=hard 3=good 4=easy
	ease: real('ease').default(2.5).notNull(), // SM-2 ease factor
	interval: integer('interval').default(1).notNull(), // days until next review
	nextReviewAt: timestamp('next_review_at').notNull(),
	reviewedAt: timestamp('reviewed_at').defaultNow().notNull()
});

// relations
export const skillsRelations = relations(skills, ({ many }) => ({
	userSkills: many(userSkills),
	flashcards: many(flashcards)
}));

export const userSkillsRelations = relations(userSkills, ({ one }) => ({
	user: one(user, { fields: [userSkills.userId], references: [user.id] }),
	skill: one(skills, { fields: [userSkills.skillId], references: [skills.id] })
}));

export const flashcardsRelations = relations(flashcards, ({ one, many }) => ({
	skill: one(skills, { fields: [flashcards.skillId], references: [skills.id] }),
	reviewLogs: many(reviewLog)
}));

export const reviewLogRelations = relations(reviewLog, ({ one }) => ({
	user: one(user, { fields: [reviewLog.userId], references: [user.id] }),
	flashcard: one(flashcards, { fields: [reviewLog.flashcardId], references: [flashcards.id] })
}));
