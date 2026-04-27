import type { AppRouter } from '@file-drive/api/routers/index'
import { env } from '@file-drive/env/native'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { Platform } from 'react-native'
import { authClient } from '@/lib/auth-client'
import { queryClient } from '@/utils/queryClient'

const trpcClient = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: `${env.EXPO_PUBLIC_SERVER_URL}/trpc`,
			fetch: (url, options) =>
				fetch(url, {
					...options,
					credentials: Platform.OS === 'web' ? 'include' : 'omit',
				}),
			headers() {
				if (Platform.OS === 'web') {
					return {}
				}
				const headers = new Map<string, string>()
				const cookies = authClient.getCookie()
				if (cookies) {
					headers.set('Cookie', cookies)
				}
				return Object.fromEntries(headers)
			},
		}),
	],
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
	client: trpcClient,
	queryClient,
})
