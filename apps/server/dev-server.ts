import app from './src'

Bun.serve({
	fetch: app.fetch,
	hostname: '0.0.0.0',
	port: 3000,
})
