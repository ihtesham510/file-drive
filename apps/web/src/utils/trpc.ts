import type { AppRouter } from '@file-drive/api/routers/index'
import { env } from '@file-drive/env/web'
import { QueryCache } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { toast } from 'sonner'
import { getQueryClient } from '@/lib/query-client'

export const queryClient = getQueryClient({
	onSuccess({ message }) {
		toast.success(message)
	},
	onError({ message }) {
		toast.error(message)
	},
	queryCache: new QueryCache({
		onError: (error, query) => {
			toast.error(error.message, {
				action: {
					label: 'retry',
					onClick: query.invalidate,
				},
			})
		},
	}),
})

export const trpcClient = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: `${env.VITE_SERVER_URL}/trpc`,
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
