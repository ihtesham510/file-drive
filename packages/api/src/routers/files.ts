import { db } from '@file-drive/db'
import { file } from '@file-drive/db/schema/files'
import { trash } from '@file-drive/db/schema/trash'
import { getFileUrl, getUploadUrl } from '@file-drive/s3'
import { and, eq, inArray } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import z from 'zod'
import { protectedProcedure, router } from '../index'

export const fileRouter = router({
	getUploadUrl: protectedProcedure
		.input(
			z.object({
				fileName: z.string(),
				contentType: z.string(),
			}),
		)
		.mutation(async ({ input, ctx: { userId } }) => {
			return await getUploadUrl(input.fileName, userId, input.contentType)
		}),
	list: protectedProcedure.query(async ({ ctx: { userId } }) => {
		const trashFiles = (
			await db
				.select({ file: trash.file })
				.from(trash)
				.where(eq(trash.user, userId))
		).map(trash => trash.file)
		const files = await db.select().from(file).where(eq(file.user, userId))
		return Promise.all(
			files
				.filter(file => !trashFiles.includes(file.id))
				.map(async file => ({ ...file, url: await getFileUrl(file.key) })),
		)
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
