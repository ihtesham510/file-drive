import { db } from '@file-drive/db'
import { session as sessionTable } from '@file-drive/db/schema/auth'
import { getS3Client, uploadFile } from '@file-drive/s3'
import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import z from 'zod'

const s3Client = getS3Client()

const app = new Hono<{
	Variables: {
		userId: string | null
	}
}>()
	.use('/', async (c, next) => {
		const token = c.req.header('Authorization')
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
				bucket: 'file-drive',
			})
			return c.json({ key })
		},
	)

export default app
