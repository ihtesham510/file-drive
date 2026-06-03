import { useMutation, useQuery } from '@tanstack/react-query'
import { trpc } from '@/utils/trpc'

export function useFavorites() {
	const favoritesFiles = useQuery(trpc.favorites.list_files.queryOptions())
	const favoritesIds = useQuery(trpc.favorites.list_ids.queryOptions())

	const removeFromFavorites = useMutation(
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
	return {
		favoritesFiles,
		favoritesIds,
		removeFromFavorites,
	}
}
