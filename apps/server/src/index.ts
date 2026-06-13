import { Hono } from 'hono'

const app = new Hono()
	// .use(logger())
	// .use(
	// 	'/api/*',
	// 	cors({
	// 		origin: env.CORS_ORIGIN,
	// 		allowMethods: ['GET', 'POST', 'OPTIONS'],
	// 		allowHeaders: ['Content-Type', 'Authorization'],
	// 		credentials: true,
	// 	}),
	// )
	// .on(['POST', 'GET'], '/api/auth/*', c => auth.handler(c.req.raw))
	// .use(
	// 	'/trpc/*',
	// 	trpcServer({
	// 		router: appRouter,
	// 		createContext: (_opts, context) => {
	// 			return createContext({ context })
	// 		},
	// 	}),
	// )
	// .route('/upload', uploadRoute)
	// .route('/file-drive', proxyRoute)
	.get('/', c => c.json('OK'))

export default app
