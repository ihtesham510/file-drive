import { type QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import type { TrpcProxy } from './utils/trpc'

export function getFavoritesConfig(trpc: TrpcProxy, queryClient: QueryClient) {
	const useFavoritesFiles = () =>
		useQuery(trpc.favorites.list_files.queryOptions())
	const useFavoritesFileIds = () =>
		useQuery(trpc.favorites.list_ids.queryOptions())

	const useDeleteFavorites = () =>
		useMutation(
			trpc.favorites.remove.mutationOptions({
				onMutate({ ids }, { client }) {
					client.setQueryData(trpc.favorites.list_files.queryKey(), data =>
						data?.filter(favFile => ids.includes(favFile.favorites.file)),
					)
				},
				meta: {
					onSuccess: {
						type: 'success',
						message: 'Removed from favorites',
					},
					onError: {
						type: 'error',
						message: 'Error while removing from favorites',
					},
					invalidateQueries: [
						trpc.favorites.list_ids.queryKey(),
						trpc.favorites.list_files.queryKey(),
					],
				},
			}),
		)

	const prefetchFavorites = async () => {
		await queryClient.ensureQueryData({
			queryKey: trpc.favorites.list_files.queryKey(),
		})
		await queryClient.ensureQueryData({
			queryKey: trpc.favorites.list_ids.queryKey(),
		})
	}

	return {
		useFavoritesFiles,
		useDeleteFavorites,
		prefetchFavorites,
		useFavoritesFileIds,
	}
}
