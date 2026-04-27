import { relations } from 'drizzle-orm'
import { account, session, user } from './auth'
import { file } from './files'

export const fileRelations = relations(file, ({ one }) => ({
	user: one(user, { fields: [file.user], references: [user.id] }),
}))

/*-------------Auth and User Relations-------------*/
export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	files: many(file),
}))

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}))

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}))
