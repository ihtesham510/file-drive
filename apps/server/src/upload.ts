import { db } from '@file-drive/db'
import { session as sessionTable } from '@file-drive/db/schema/auth'
import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import z from 'zod'
import { s3Client } from './s3/client'
import { uploadFile } from './s3/functions'

const app = new Hono<{
	Variables: {
		userId: string | null
	}
}>()
	.use('*', async (c, next) => {
		const token = c.req.header('Authorization')
		console.log(token)
		if (!token) return c.json({ error: 'unauthorized' }, 401)
		const session = (
			await db
				.select()
				.from(sessionTable)
				.where(eq(sessionTable.token, token))
				.limit(1)
		)[0]
		c.set('userId', session?.userId ?? null)
		return await next()
	})
	.post(
		'/',
		zValidator(
			'header',
			z.object({
				contentType: z.string(),
				fileName: z.string(),
			}),
		),
		async c => {
			console.log(c.req.raw)
			const userId = c.get('userId')
			if (!userId) {
				return c.json({ error: 'unauthorized' }, 401)
			}
			const arrayBuffer = await c.req.arrayBuffer()
			const { contentType, fileName } = c.req.valid('header')
			const file = new Uint8Array(arrayBuffer)
			const client = s3Client
			const key = await uploadFile({
				contentType,
				fileName,
				file,
				client,
				userId,
			})
			return c.json({ key })
		},
	)

export default app
