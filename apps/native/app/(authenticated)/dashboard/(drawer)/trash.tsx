import { ArrowTurnBackwardIcon, Trash } from '@hugeicons/core-free-icons'
import { useCSSVariable } from 'uniwind'
import { RenderUnderIcon } from '@/components/common/render-under-icons'
import { FilesList } from '@/components/dashboard/files-list'
import { useTrash } from '@/hooks/use-trash'

const SNAP_POINT = 150
const OFF_SET = 8

export default function Page() {
	const [iconColor] = useCSSVariable(['--color-primary-foreground']) as string[]
	const { files, restore } = useTrash()
	if (!files.data) return null
	return (
		<FilesList
			onReload={async () => {
				await files.refetch()
			}}
			shouldExpandRight={() => true}
			shouldExpandLeft={() => false}
			data={files.data?.map(({ file }) => ({
				...file,
				createdAt: new Date(file.createdAt),
				updatedAt: new Date(file.updatedAt),
			}))}
			underLeftContent={(_, _props) => {
				return (
					<RenderUnderIcon
						offset={OFF_SET}
						side='left'
						icon={ArrowTurnBackwardIcon}
						viewProps={{
							className: 'bg-primary',
						}}
						textProps={{
							className: 'text-primary-foreground',
						}}
						text='Restore'
						iconColor={iconColor}
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
						text='Delete Permanently'
						iconColor={iconColor}
						buttonProps={_props}
						snapPoint={SNAP_POINT}
					/>
				)
			}}
			onPressLeft={file => {
				restore(file.id)
			}}
			onPressRight={_file => {
				// TODO: implement permanent delete
			}}
		/>
	)
}
