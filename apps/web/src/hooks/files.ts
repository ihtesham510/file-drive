import { getFilesConfig } from '@file-drive/query/files'
import { queryClient, trpc } from '@/utils/trpc'

export const { useFilesList, useDeleteFiles, prefetchFiles } = getFilesConfig(
	trpc,
	queryClient,
)
