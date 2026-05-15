import { StarIcon, StarOffIcon, Trash } from '@hugeicons/core-free-icons'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCSSVariable } from 'uniwind'
import { NotFoundIllustration } from '@/components/common/not-found-illustration'
import { RenderUnderIcon } from '@/components/common/render-under-icons'
import { ThemedView } from '@/components/common/themed-view'
import { FilesList } from '@/components/dashboard/files-list'
import { OFF_SET, SNAP_POINT } from '@/constants'
import { useFavorites } from '@/hooks/use-favorites'
import { useTrash } from '@/hooks/use-trash'
import { trpc } from '@/utils/trpc'

export default function Page() {
	const [rightIconColor, leftIconColor] = useCSSVariable([
		'--color-destructive-foreground',
		'--color-primary-foreground',
	]) as string[]
	const files = useQuery(trpc.files.list.queryOptions())
	const insets = useSafeAreaInsets()
	const { favorites, toggle } = useFavorites()
	const { add: addToTrash, trash } = useTrash()
	if (!files.data) return null
	if (!files.isLoading && files.data && files.data.length === 0)
		return (
			<ThemedView className='flex-1' style={{ paddingBottom: insets.bottom }}>
				<NotFoundIllustration
					title='No Files yet'
					description="you've not yet added any files upload files to get started"
					button='Upload'
					onPress={() => router.push('/dashboard/upload')}
				/>
			</ThemedView>
		)
	return (
		<FilesList
			onReload={async () => {
				await files.refetch()
				await favorites.refetch()
				await trash.refetch()
			}}
			data={files.data.map(file => ({
				...file,
				createdAt: new Date(file.createdAt),
				updatedAt: new Date(file.updatedAt),
			}))}
			underLeftContent={(_file, _props) => {
				const isFavorite = !!favorites.data?.includes(_file.id)
				return (
					<RenderUnderIcon
						offset={OFF_SET}
						side='left'
						icon={isFavorite ? StarOffIcon : StarIcon}
						viewProps={{
							className: 'bg-primary',
						}}
						textProps={{
							className: 'text-primary-foreground',
						}}
						text={isFavorite ? 'Remove From Favorites' : 'Add To Favorites'}
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
						iconColor={rightIconColor}
						text='Move To Trash'
						buttonProps={_props}
						snapPoint={SNAP_POINT}
					/>
				)
			}}
			onPressRight={file => addToTrash(file.id)}
			onPressLeft={file => toggle(file.id)}
			shouldExpandRight={() => true}
			shouldExpandLeft={_file => !!favorites.data?.includes(_file.id)}
		/>
	)
}
