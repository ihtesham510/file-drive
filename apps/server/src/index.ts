import { createContext } from '@file-drive/api/context'
import { appRouter } from '@file-drive/api/routers/index'
import { auth } from '@file-drive/auth'
import { env } from '@file-drive/env/server'
import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import proxyRoute from './proxy'
import uploadRoute from './upload'

const app = new Hono()

app.use(logger())
app.use('/*', serveStatic({ root: '../web/dist' }))
app.use(
	'/*',
	cors({
		origin: env.CORS_ORIGIN,
		allowMethods: ['GET', 'POST', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	}),
)

app.on(['POST', 'GET'], '/api/auth/*', c => auth.handler(c.req.raw))

app.use(
	'/trpc/*',
	trpcServer({
		router: appRouter,
		createContext: (_opts, context) => {
			return createContext({ context })
		},
	}),
)

app.route('/upload', uploadRoute)
app.route('/file-drive', proxyRoute)

Bun.serve({
	fetch: app.fetch,
	port: 3000,
	hostname: '0.0.0.0',
})
