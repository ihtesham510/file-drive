import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const trash = pgTable('trash', {
	id: uuid('id').defaultRandom().primaryKey(),
	file: uuid('file').notNull(),
	user: text('user').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
})
