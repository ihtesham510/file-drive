import { getFavoritesConfig } from '@file-drive/query/favorites'
import { queryClient, trpc } from '@/utils/trpc'

export const {
	prefetchFavorites,
	useFavoritesFiles,
	useDeleteFavorites,
	useFavoritesFileIds,
} = getFavoritesConfig(trpc, queryClient)
