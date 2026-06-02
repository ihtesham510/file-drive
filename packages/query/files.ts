import { type QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import type { TrpcProxy } from './utils/trpc'

export function getFilesConfig(trpc: TrpcProxy, queryClient: QueryClient) {
	const useFilesList = () => useQuery(trpc.files.list.queryOptions())
	const useDeleteFiles = () =>
		useMutation(
			trpc.files.delete.mutationOptions({
				onMutate({ ids }, { client }) {
					client.setQueryData(trpc.files.list.queryKey(), data =>
						data?.filter(file => !ids.includes(file.id)),
					)
				},
				meta: {
					onSuccess: {
						type: 'success',
						message: 'deleted file successfully',
					},
					onError: {
						type: 'error',
						message: 'error while deleting file',
					},
					invalidateQueries: [
						trpc.files.list.queryKey(),
						trpc.favorites.list_files.queryKey(),
						trpc.favorites.list_ids.queryKey(),
						trpc.trash.list_files.queryKey(),
						trpc.trash.list_ids.queryKey(),
					],
				},
			}),
		)

	const prefetchFiles = () =>
		queryClient.ensureQueryData(trpc.files.list.queryOptions())

	return { useFilesList, useDeleteFiles, prefetchFiles }
}
