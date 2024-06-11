/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	integer,
	serial,
	text,
	pgTable,
	varchar,
	boolean,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: text('email'),
	sub: text('sub'),
});

export const posts = pgTable('posts', {
	id: serial('id').primaryKey(),
	user_id: integer('user_id').references(() => users.id), // Foreign key reference to User
	title: varchar('title', { length: 200 }).notNull(),
});
