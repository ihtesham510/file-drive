import { useMutation, useQuery } from '@tanstack/react-query'
import { trpc } from '@/utils/trpc'

export function useFiles() {
	const files = useQuery(trpc.files.list.queryOptions())
	const deleteFiles = useMutation(
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
	return { files, deleteFiles }
}
