import { db } from '@file-drive/db'
import { favorites } from '@file-drive/db/schema/favorites'
import { file } from '@file-drive/db/schema/files'
import { and, eq } from 'drizzle-orm'
import z from 'zod'
import { protectedProcedure, router } from '../index'

export const favoritesRouter = router({
	list_ids: protectedProcedure.query(async ({ ctx: { userId } }) => {
		return (
			await db
				.select({ file: favorites.file })
				.from(favorites)
				.where(eq(favorites.user, userId))
		).map(file => file.file)
	}),
	list_files: protectedProcedure.query(async ({ ctx: { userId } }) => {
		return await db
			.select()
			.from(favorites)
			.innerJoin(file, eq(favorites.file, file.id))
			.where(eq(favorites.user, userId))
	}),
	add: protectedProcedure
		.input(z.string())
		.mutation(async ({ ctx: { userId }, input }) => {
			const exits = !!(
				await db
					.select({ file: favorites.file })
					.from(favorites)
					.where(and(eq(favorites.user, userId), eq(favorites.file, input)))
					.limit(1)
			)[0]
			if (exits) return
			return await db.insert(favorites).values({
				user: userId,
				file: input,
			})
		}),
	remove: protectedProcedure
		.input(z.string())
		.mutation(async ({ ctx: { userId }, input }) => {
			return await db
				.delete(favorites)
				.where(and(eq(favorites.file, input), eq(favorites.user, userId)))
		}),
})
