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
			.select({ file: file })
			.from(trash)
			.innerJoin(file, eq(trash.file, file.id))
			.where(eq(trash.user, userId))
	}),
	add: protectedProcedure
		.input(z.object({ ids: z.array(z.string()) }))
		.mutation(async ({ ctx: { userId }, input: { ids } }) => {
			await new Promise(res => setTimeout(res, 3000))
			return await Promise.all(
				ids.map(async id => {
					console.log('moving to trash', id)
					const exits = !!(
						await db.select().from(trash).where(eq(trash.file, id)).limit(1)
					)[0]
					if (exits) {
						console.log('file already exits in trash')
						return
					}
					return await db.insert(trash).values({ file: id, user: userId })
				}),
			)
		}),
	restore: protectedProcedure
		.input(
			z.object({
				ids: z.array(z.string()),
			}),
		)
		.mutation(async ({ ctx: { userId }, input: { ids } }) => {
			return await Promise.all(
				ids.map(
					async id =>
						await db
							.delete(trash)
							.where(and(eq(trash.file, id), eq(trash.user, userId))),
				),
			)
		}),
})
