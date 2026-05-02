import type { FileSchema } from '@file-drive/db/schema/zod'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native'
import { Image } from 'expo-image'
import { View, type ViewProps } from 'react-native'
import { useResolveClassNames } from 'uniwind'
import { ScrollList } from '@/components/common/scroll-list'
import { SwipeAbleView } from '@/components/common/swipeable-view'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'
import { cn } from '@/lib/utils'
import { getUri } from '@/utils/uri'

interface Props {
	data: FileSchema[]
	onReload?: () => Promise<void>
	underRightIcon?: (data: FileSchema) => IconSvgElement
	underLeftIcon?: (data: FileSchema) => IconSvgElement
	canSwipeRigth?: boolean
	canSwipeLeft?: boolean
	onSwipeRight?: (item: FileSchema) => void
	onSwipeLeft?: (item: FileSchema) => void
	underRightView?: ViewProps
	underLeftView?: ViewProps
}
export function FilesList(props: Props) {
	const imageStyles = useResolveClassNames('size-15 rounded-lg bg-primary')
	return (
		<ScrollList
			data={props.data}
			onScroll={e => e.nativeEvent.contentOffset.y === 0}
			showsVerticalScrollIndicator={false}
			refreshableContentProps={{
				onReload: async () => await props.onReload?.(),
			}}
			contentContainerClassName='gap-4'
			keyExtractor={file => file.id}
			renderItem={({ item }) => {
				const leftIcon = props.underLeftIcon?.(item)
				const rigthIcon = props.underRightIcon?.(item)
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
									<View
										className={cn(
											'h-full w-[50%] flex-row items-center justify-start rounded-md pl-4',
											props.underLeftView?.className,
										)}
									>
										{leftIcon && <HugeiconsIcon icon={leftIcon} size={28} />}
									</View>
									<View
										className={cn(
											'h-full w-[50%] flex-row items-center justify-end rounded-md pr-4',
											props.underRightView?.className,
										)}
									>
										{rigthIcon && <HugeiconsIcon icon={rigthIcon} size={18} />}
									</View>
								</View>
							}
							thrustHold={70}
							onSwipeLeft={() => props.onSwipeLeft?.(item)}
							onSwipeRight={() => props.onSwipeRight?.(item)}
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
