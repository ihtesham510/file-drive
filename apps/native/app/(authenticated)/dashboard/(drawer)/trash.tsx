import { ArrowTurnBackwardIcon } from '@hugeicons/core-free-icons'
import { FilesList } from '@/components/dashboard/files-list'
import { useTrash } from '@/hooks/use-trash'

export default function Page() {
	const { files, restore } = useTrash()
	if (!files.data) return null
	return (
		<FilesList
			onReload={async () => {
				await files.refetch()
			}}
			data={files.data?.map(({ file }) => ({
				...file,
				createdAt: new Date(file.createdAt),
				updatedAt: new Date(file.updatedAt),
			}))}
			canSwipeLeft={false}
			underRightView={{
				className: 'bg-primary',
			}}
			underRightIcon={() => ArrowTurnBackwardIcon}
			onSwipeRight={file => {
				restore(file.id)
			}}
		/>
	)
}
