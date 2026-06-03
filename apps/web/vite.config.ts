import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	return {
		server: {
			port: 3001,
			proxy: {
				'/trpc': {
					changeOrigin: true,
					target: env.VITE_SERVER_URL,
				},
				'/api': {
					changeOrigin: true,
					target: env.VITE_SERVER_URL,
				},
			},
		},
		resolve: {
			tsconfigPaths: true,
		},
		plugins: [
			tailwindcss(),
			tanstackRouter({
				target: 'react',
				autoCodeSplitting: true,
			}),
			react(),
		],
	}
})
