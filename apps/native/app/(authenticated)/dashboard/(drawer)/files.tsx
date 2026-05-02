import { Delete02Icon, StarIcon, StarOffIcon } from '@hugeicons/core-free-icons'
import { useQuery } from '@tanstack/react-query'
import { FilesList } from '@/components/dashboard/files-list'
import { useFavorites } from '@/hooks/use-favorites'
import { useTrash } from '@/hooks/use-trash'
import { trpc } from '@/utils/trpc'

export default function Page() {
	const files = useQuery(trpc.files.list.queryOptions())
	const { favorites, toggle } = useFavorites()
	const { add: addToTrash } = useTrash()
	if (!files.data) return null
	return (
		<FilesList
			data={files.data.map(file => ({
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
