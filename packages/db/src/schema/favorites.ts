import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const favorites = pgTable('favorites', {
	id: uuid('id').defaultRandom().primaryKey(),
	file: text('file').notNull(),
	user: text('user').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
})
