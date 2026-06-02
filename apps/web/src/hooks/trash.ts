import { getTrashFn } from '@file-drive/query/trash'
import { queryClient, trpc } from '@/utils/trpc'

export const {
	useAddToTrash,
	useTrashIds,
	prefetchTrash,
	useTrashFiles,
	useRestoreFile,
} = getTrashFn(trpc, queryClient)
