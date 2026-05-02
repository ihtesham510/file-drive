import { db } from '@file-drive/db'
import { file } from '@file-drive/db/schema/files'
import { trash } from '@file-drive/db/schema/trash'
import { and, eq, inArray, notExists } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import z from 'zod'
import { protectedProcedure, router } from '../index'

export const fileRouter = router({
	list: protectedProcedure.query(async ({ ctx: { userId } }) => {
		try {
			return await db
				.select()
				.from(file)
				.where(
					and(
						eq(file.user, userId),
						notExists(db.select().from(trash).where(eq(trash.user, userId))),
					),
				)
		} catch (err) {
			console.log(err)
		}
	}),
	create: protectedProcedure
		.input(createInsertSchema(file).omit({ user: true }))
		.mutation(async ({ ctx: { userId }, input }) => {
			return await db.insert(file).values({ ...input, user: userId })
		}),
	delete: protectedProcedure
		.input(z.object({ ids: z.array(z.string()) }))
		.mutation(async ({ ctx: { userId }, input }) => {
			return await db
				.delete(file)
				.where(and(inArray(file.id, input.ids), eq(file.user, userId)))
		}),
})
