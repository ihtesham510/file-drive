import { StarOffIcon, Trash } from '@hugeicons/core-free-icons'
import { useCSSVariable } from 'uniwind'
import { RenderUnderIcon } from '@/components/common/render-under-icons'
import { FilesList } from '@/components/dashboard/files-list'
import { OFF_SET, SNAP_POINT } from '@/constants'
import { useFavorites } from '@/hooks/use-favorites'
import { useTrash } from '@/hooks/use-trash'

export default function Page() {
	const [rightIconColor, leftIconColor] = useCSSVariable([
		'--color-destructive-foreground',
		'--color-primary-foreground',
	]) as string[]
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
			underLeftContent={(_, _props) => {
				return (
					<RenderUnderIcon
						offset={OFF_SET}
						side='left'
						icon={StarOffIcon}
						viewProps={{
							className: 'bg-primary',
						}}
						textProps={{
							className: 'text-primary-foreground',
						}}
						text={'Remove From Favorites'}
						iconColor={leftIconColor}
						buttonProps={_props}
						snapPoint={SNAP_POINT}
					/>
				)
			}}
			underRightContnet={(_, _props) => {
				return (
					<RenderUnderIcon
						offset={OFF_SET}
						side='right'
						icon={Trash}
						viewProps={{
							className: 'bg-destructive',
						}}
						textProps={{
							className: 'text-destructive-foreground',
						}}
						text='Remove From Favorites'
						iconColor={rightIconColor}
						buttonProps={_props}
						snapPoint={SNAP_POINT}
					/>
				)
			}}
			shouldExpandLeft={() => true}
			shouldExpandRight={() => true}
			onPressRight={file => addToTrash(file.id)}
			onPressLeft={file => toggle(file.id)}
		/>
	)
}
