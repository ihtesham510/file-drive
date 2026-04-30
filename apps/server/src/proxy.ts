import { env } from '@file-drive/env/server'
import { Hono } from 'hono'
import { proxy } from 'hono/proxy'

const app = new Hono().get('/:path{.+}', c => {
	const filePath = c.req.param('path')
	const fullUrl = `${env.S3URL}/file-drive/${filePath}`
	return proxy(fullUrl, c.req)
})

export default app
