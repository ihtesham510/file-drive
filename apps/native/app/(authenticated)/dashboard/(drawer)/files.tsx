import { StarIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { NotFoundIllustration } from '@/components/common/not-found-illustration'
import { ThemedView } from '@/components/common/themed-view'
import { FilesList } from '@/components/dashboard/files-list'
import { useFavorites } from '@/hooks/use-favorites'
import { useTrash } from '@/hooks/use-trash'
import { trpc } from '@/utils/trpc'

export default function Page() {
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
		<ThemedView className='flex-1' style={{ paddingBottom: insets.bottom }}>
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
					return (
						<ThemedView>
							<HugeiconsIcon icon={StarIcon} size={38} />
						</ThemedView>
					)
				}}
				underRightContnet={(_file, _props) => {
					return (
						<ThemedView className='flex-1 items-center justify-center'>
							<HugeiconsIcon icon={StarIcon} size={38} />
						</ThemedView>
					)
				}}
				onPressRight={file => addToTrash(file.id)}
				onPressLeft={file => toggle(file.id)}
			/>
		</ThemedView>
	)
}
