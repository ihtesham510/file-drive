import { useMutation, useQuery } from '@tanstack/react-query'
import { trpc } from '@/utils/trpc'

export function useTrash() {
	const trashFiles = useQuery(trpc.trash.list_files.queryOptions())
	const trashIds = useQuery(trpc.trash.list_ids.queryOptions())
	const addToTrash = useMutation(
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
	const restoreFile = useMutation(
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
	return {
		trashFiles,
		trashIds,
		restoreFile,
		addToTrash,
	}
}
