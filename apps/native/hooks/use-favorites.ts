import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { trpc } from '@/utils/trpc'

const queryOptions = trpc.favorites.list_ids.queryOptions()
const trpcFavorites = trpc.favorites
const queryKey = trpc.favorites.list_ids.queryKey()

export function useFavorites() {
	const favorites = useQuery(queryOptions)
	const queryClient = useQueryClient()
	const addMutation = useMutation(
		trpcFavorites.add.mutationOptions({
			meta: {
				queryKey,
			},
		}),
	)
	const removeMutation = useMutation(
		trpcFavorites.remove.mutationOptions({
			meta: {
				queryKey,
			},
			onError(error) {
				console.log(error)
			},
		}),
	)
	const add = useCallback(
		(id: string) => {
			queryClient.setQueryData(queryKey, data => {
				if (!data) return
				return [...data, id]
			})
			addMutation.mutate(id)
		},
		[queryClient.setQueryData, addMutation.mutate],
	)
	const remove = useCallback(
		(id: string) => {
			queryClient.setQueryData(queryKey, data => {
				if (!data) return
				return data.filter(file => file !== id)
			})
			removeMutation.mutate(id)
		},
		[queryClient.setQueryData, removeMutation.mutate],
	)
	const toggle = useCallback(
		(id: string) => {
			const data = queryClient.getQueryData(queryKey)
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

	return { favorites, add, remove, toggle }
}
