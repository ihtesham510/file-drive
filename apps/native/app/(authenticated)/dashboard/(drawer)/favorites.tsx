import { FilesList } from '@/components/dashboard/files-list'
import { useFavorites } from '@/hooks/use-favorites'
import { useTrash } from '@/hooks/use-trash'

// TODO: add other options here

export default function Page() {
	const { favFiles, toggle } = useFavorites()
	const { add: addToTrash } = useTrash()
	const files = favFiles.data?.map(file => file.file)
	if (!files) return null
	return (
		<FilesList
			data={files?.map(file => ({
				...file,
				createdAt: new Date(file.createdAt),
				updatedAt: new Date(file.updatedAt),
			}))}
			onPressRight={file => addToTrash(file.id)}
			onPressLeft={file => toggle(file.id)}
		/>
	)
}
