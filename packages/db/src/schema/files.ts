import { pgTable, text, uuid } from 'drizzle-orm/pg-core'

export const file = pgTable('file', {
	id: uuid('id').defaultRandom().primaryKey(),
	user: text('user').notNull(),
	name: text('name').notNull(),
	type: text('type').notNull(),
	key: text('key').notNull(),
})
