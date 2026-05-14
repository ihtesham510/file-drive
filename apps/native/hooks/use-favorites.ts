import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { trpc } from '@/utils/trpc'

const favoritesIdsQueryOptions = trpc.favorites.list_ids.queryOptions()
const favoritesFilesQueryOptions = trpc.favorites.list_files.queryOptions()
const trpcFavorites = trpc.favorites
const faovoritesIdsQueryKey = trpc.favorites.list_ids.queryKey()
const favoritesFilesQueryKey = trpc.favorites.list_files.queryKey()

export function useFavorites() {
	const favorites = useQuery(favoritesIdsQueryOptions)
	const favFiles = useQuery(favoritesFilesQueryOptions)
	const queryClient = useQueryClient()
	const addMutation = useMutation(
		trpcFavorites.add.mutationOptions({
			meta: {
				queryKeys: [faovoritesIdsQueryKey, favoritesFilesQueryKey],
			},
		}),
	)
	const removeMutation = useMutation(
		trpcFavorites.remove.mutationOptions({
			meta: {
				queryKeys: [faovoritesIdsQueryKey, favoritesFilesQueryKey],
			},
			onError(error) {
				console.log(error)
			},
		}),
	)
	const add = useCallback(
		(id: string) => {
			queryClient.setQueryData(faovoritesIdsQueryKey, data => {
				if (!data) return
				return [...data, id]
			})
			addMutation.mutate(id)
		},
		[queryClient.setQueryData, addMutation.mutate],
	)
	const remove = useCallback(
		(id: string) => {
			queryClient.setQueryData(faovoritesIdsQueryKey, data => {
				if (!data) return
				return data.filter(file => file !== id)
			})
			queryClient.setQueryData(favoritesFilesQueryKey, data => {
				if (!data) return
				return data.filter(file => file.file.id !== id)
			})
			removeMutation.mutate(id)
		},
		[queryClient.setQueryData, removeMutation.mutate],
	)
	const toggle = useCallback(
		(id: string) => {
			const data = queryClient.getQueryData(faovoritesIdsQueryKey)
			if (!data) return
			if (data.includes(id)) {
				remove(id)
				return
			}
			add(id)
			return
		},
		[queryClient, add, remove],
	)

	return { favFiles, favorites, add, remove, toggle }
}
