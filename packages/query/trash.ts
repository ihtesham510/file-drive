import { type QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import type { TrpcProxy } from './utils/trpc'

export function getTrashFn(trpc: TrpcProxy, queryClient: QueryClient) {
	const useTrashFiles = () => useQuery(trpc.trash.list_files.queryOptions())
	const useTrashIds = () => useQuery(trpc.trash.list_ids.queryOptions())
	const useAddToTrash = () =>
		useMutation(
			trpc.trash.add.mutationOptions({
				onMutate({ ids }, { client }) {
					client.setQueryData(trpc.files.list.queryKey(), data =>
						data?.filter(file => !ids.includes(file.id)),
					)
					client.setQueryData(trpc.favorites.list_files.queryKey(), data =>
						data?.filter(file => !ids.includes(file.favorites.file)),
					)
					client.setQueryData(trpc.favorites.list_ids.queryKey(), data =>
						data?.filter(file => !ids.includes(file)),
					)
				},
				meta: {
					onSuccess: {
						type: 'success',
						message: 'moved to trash',
					},
					onError: {
						type: 'error',
						message: 'Error while moving to trash',
					},
				},
			}),
		)

	const useRestoreFile = () =>
		useMutation(
			trpc.trash.restore.mutationOptions({
				onMutate: ({ ids }, { client }) => {
					client.setQueryData(trpc.trash.list_files.queryKey(), data =>
						data?.filter(file => !ids.includes(file.file.id)),
					)
					client.setQueryData(trpc.trash.list_ids.queryKey(), data =>
						data?.filter(file => !ids.includes(file)),
					)
				},
				meta: {
					onSuccess: {
						type: 'success',
						message: 'Successfully restored file',
					},
					onError: {
						type: 'error',
						message: 'Error while restoring file',
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

	const prefetchTrash = async () => {
		await queryClient.ensureQueryData(trpc.trash.list_files.queryOptions())
		await queryClient.ensureQueryData(trpc.trash.list_ids.queryOptions())
	}
	return {
		useTrashFiles,
		useTrashIds,
		prefetchTrash,
		useAddToTrash,
		useRestoreFile,
	}
}
