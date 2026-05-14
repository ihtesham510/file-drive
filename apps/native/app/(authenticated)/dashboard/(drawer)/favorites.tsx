import { Delete02Icon, StarIcon, StarOffIcon } from '@hugeicons/core-free-icons'
import { FilesList } from '@/components/dashboard/files-list'
import { useFavorites } from '@/hooks/use-favorites'
import { useTrash } from '@/hooks/use-trash'

export default function Page() {
	const { favFiles, favorites, toggle } = useFavorites()
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
			underLeftView={{
				className: 'bg-primary',
			}}
			underRightView={{
				className: 'bg-destructive',
			}}
			underLeftIcon={file =>
				favorites.data?.includes(file.id) ? StarOffIcon : StarIcon
			}
			underRightIcon={() => Delete02Icon}
			onSwipeRight={file => addToTrash(file.id)}
			onSwipeLeft={file => toggle(file.id)}
		/>
	)
}
