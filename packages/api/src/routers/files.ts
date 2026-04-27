import { db } from '@file-drive/db'
import { file } from '@file-drive/db/schema/files'
import { and, eq, inArray } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import z from 'zod'
import { protectedProcedure, router } from '../index'

export const fileRouter = router({
	list: protectedProcedure.query(async ({ ctx: { userId } }) => {
		return await db.select().from(file).where(eq(file.user, userId))
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
