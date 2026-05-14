import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { trpc } from '@/utils/trpc'

const trashQueryKey = trpc.trash.list_ids.queryKey()
const trashFilesQueryKey = trpc.trash.list_files.queryKey()
const filesQueryKey = trpc.files.list.queryKey()

export function useTrash() {
	const queryClient = useQueryClient()
	const trash = useQuery(trpc.trash.list_ids.queryOptions())
	const files = useQuery(trpc.trash.list_files.queryOptions())

	const addMutation = useMutation(
		trpc.trash.add.mutationOptions({
			meta: {
				queryKeys: [trashQueryKey, filesQueryKey],
			},
		}),
	)
	const restoreMutation = useMutation(
		trpc.trash.restore.mutationOptions({
			meta: {
				queryKeys: [trashQueryKey, filesQueryKey],
			},
		}),
	)

	const add = useCallback(
		(id: string) => {
			queryClient.setQueryData(trashQueryKey, data =>
				data ? [...data, id] : data,
			)
			queryClient.setQueryData(filesQueryKey, data =>
				data?.filter(file => file.id !== id),
			)
			addMutation.mutate(id)
		},
		[queryClient, addMutation.mutate],
	)
	const restore = useCallback(
		(id: string) => {
			queryClient.setQueryData(trashQueryKey, data =>
				data?.filter(fileId => fileId !== id),
			)
			queryClient.setQueryData(trashFilesQueryKey, data =>
				data?.filter(trashFile => trashFile.file.id !== id),
			)
			restoreMutation.mutate(id)
		},
		[queryClient, restoreMutation.mutate],
	)

	return { files, trash, add, restore }
}
