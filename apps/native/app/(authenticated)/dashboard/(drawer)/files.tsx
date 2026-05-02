import { Delete02Icon, StarIcon, StarOffIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { View } from 'react-native'
import { useResolveClassNames } from 'uniwind'
import { ScrollList } from '@/components/common/scroll-list'
import { SwipeAbleView } from '@/components/common/swipeable-view'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'
import { useFavorites } from '@/hooks/use-favorites'
import { useTrash } from '@/hooks/use-trash'
import { trpc } from '@/utils/trpc'
import { getUri } from '@/utils/uri'

export default function Page() {
	const files = useQuery(trpc.files.list.queryOptions())
	const { favorites, toggle } = useFavorites()
	const { add: addToTrash } = useTrash()
	const imageStyles = useResolveClassNames('size-15 rounded-lg bg-primary')

	return (
		<ScrollList
			data={files.data}
			onScroll={e => e.nativeEvent.contentOffset.y === 0}
			showsVerticalScrollIndicator={false}
			refreshableContentProps={{
				onReload: async () => {
					await files.refetch()
					await favorites.refetch()
				},
			}}
			contentContainerClassName='gap-4'
			keyExtractor={file => file.id}
			renderItem={({ item }) => {
				const isFavorite = favorites.data?.includes(item.id)
				return (
					<View className='px-4'>
						<SwipeAbleView
							underViewProps={{
								className: 'justify-between items-center rounded-md',
							}}
							contentViewProps={{
								className:
									'items-center w-full flex-row bg-background gap-4 rounded-md',
							}}
							underView={
								<View className='h-full w-full flex-row items-center justify-between rounded-md'>
									<View className='h-full w-[50%] flex-row items-center justify-start rounded-md bg-primary pl-4'>
										<HugeiconsIcon
											icon={isFavorite ? StarOffIcon : StarIcon}
											size={28}
										/>
									</View>
									<View className='h-full w-[50%] flex-row items-center justify-end rounded-md bg-destructive pr-4'>
										<HugeiconsIcon icon={Delete02Icon} size={18} />
									</View>
								</View>
							}
							thrustHold={70}
							onSwipeLeft={() => toggle(item.id)}
							onSwipeRight={() => addToTrash(item.id)}
						>
							<Image
								style={imageStyles}
								contentFit='cover'
								source={{
									uri: getUri(item.key),
								}}
							/>
							<ThemedView className='justify-center'>
								<ThemedText varient='semiBold'>{item.name}</ThemedText>
								<ThemedText className='text-muted-foreground'>
									{item.type}
								</ThemedText>
							</ThemedView>
						</SwipeAbleView>
					</View>
				)
			}}
		/>
	)
}
