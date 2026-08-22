import type { AppRouter } from '@file-drive/api/routers/index'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { queryClient } from './query-client'

export const trpcClient = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: '/trpc',
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: 'include',
				})
			},
		}),
	],
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
	client: trpcClient,
	queryClient,
})
