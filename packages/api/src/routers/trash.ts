import { db } from '@file-drive/db'
import { file } from '@file-drive/db/schema/files'
import { trash } from '@file-drive/db/schema/trash'
import { and, eq } from 'drizzle-orm'
import z from 'zod'
import { protectedProcedure, router } from '../index'

export const trashRouter = router({
	list_ids: protectedProcedure.query(async ({ ctx: { userId } }) => {
		return (
			await db
				.select({ file: trash.file })
				.from(trash)
				.where(eq(trash.user, userId))
		).map(file => file.file)
	}),
	list_files: protectedProcedure.query(async ({ ctx: { userId } }) => {
		return await db
			.select()
			.from(trash)
			.innerJoin(file, eq(trash.file, file.id))
			.where(eq(trash.user, userId))
	}),
	add: protectedProcedure
		.input(z.string())
		.mutation(async ({ ctx: { userId }, input }) => {
			return await db.insert(trash).values({ file: input, user: userId })
		}),
	restore: protectedProcedure
		.input(z.string())
		.mutation(async ({ ctx: { userId }, input }) => {
			return await db
				.delete(trash)
				.where(and(eq(trash.file, input), eq(trash.user, userId)))
		}),
})
