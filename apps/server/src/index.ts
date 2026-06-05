import { createContext } from '@file-drive/api/context'
import { appRouter } from '@file-drive/api/routers/index'
import { auth } from '@file-drive/auth'
import { env } from '@file-drive/env/server'
import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { handle } from 'hono/netlify'
import proxyRoute from './proxy'
import uploadRoute from './upload'

const app = new Hono()
	.use(logger())
	.use(
		'/api/*',
		cors({
			origin: env.CORS_ORIGIN,
			allowMethods: ['GET', 'POST', 'OPTIONS'],
			allowHeaders: ['Content-Type', 'Authorization'],
			credentials: true,
		}),
	)
	.on(['POST', 'GET'], '/api/auth/*', c => auth.handler(c.req.raw))
	.use(
		'/trpc/*',
		trpcServer({
			router: appRouter,
			createContext: (_opts, context) => {
				return createContext({ context })
			},
		}),
	)
	.route('/upload', uploadRoute)
	.route('/file-drive', proxyRoute)
	.get('/', c => c.json('OK'))

export default handle(app)
