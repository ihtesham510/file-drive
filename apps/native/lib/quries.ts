import { queryOptions } from '@tanstack/react-query'
import { client } from '@/lib/client'

export const queries = {
	files: {
		all: ['files'],
		list: () =>
			queryOptions({
				queryKey: [queries.files.all, 'list'],
				queryFn: async () => {
					const res = await client.api.file.$get()
					return await res.json()
				},
			}),
	},
}
