import { relations } from 'drizzle-orm';
import { integer, jsonb, boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const userProfiles = pgTable('user_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull()
    .unique(),
  currentClass: text('current_class'),
  targetYear: text('target_year'),
  dailyStudyTarget: integer('daily_study_target').default(60),
  targetScore: integer('target_score').default(650),
  weakSubject: text('weak_subject').default('None'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const bookmarks = pgTable('bookmarks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  questionId: text('question_id').notNull(),
  chapter: text('chapter'),
  subject: text('subject'),
  questionData: jsonb('question_data'),
  dateBookmarked: timestamp('date_bookmarked').defaultNow(),
});

export const practiceLogs = pgTable('practice_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  subject: text('subject').notNull(),
  chapter: text('chapter').notNull(),
  isCorrect: boolean('is_correct').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  bookmarks: many(bookmarks),
  practiceLogs: many(practiceLogs),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
}));

export const practiceLogsRelations = relations(practiceLogs, ({ one }) => ({
  user: one(users, {
    fields: [practiceLogs.userId],
    references: [users.id],
  }),
}));
