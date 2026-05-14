import type { FileSchema } from '@file-drive/db/schema/zod'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native'
import { Image } from 'expo-image'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { View, type ViewProps } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
} from 'react-native-reanimated'
import { runOnJS } from 'react-native-worklets'
import { useCSSVariable, useResolveClassNames } from 'uniwind'
import { ScrollList } from '@/components/common/scroll-list'
import {
	type ButtonProps,
	SwipeAbleItem,
	type SwipeableMethods,
} from '@/components/common/swipeable-view'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'
import { cn } from '@/lib/utils'
import { getUri } from '@/utils/uri'

interface FilesListProps {
	data: FileSchema[]
	onReload?: () => Promise<void>
	underLeftContent?: (data: FileSchema, props: ButtonProps) => ReactNode
	underRightContnet?: (data: FileSchema, props: ButtonProps) => ReactNode
	canSwipeRigth?: boolean
	canSwipeLeft?: boolean
	onPressRight?: (item: FileSchema) => void
	onPressLeft?: (item: FileSchema) => void
	underRightViewProps?: ViewProps
	underLeftViewProps?: ViewProps
}

interface ItemProps extends FilesListProps {
	item: FileSchema
	open?: string | null
	onOpenChange?: (id?: string) => void
}

interface ButtonViewProps extends ButtonProps {
	content: () => ReactNode
	viewProps?: ViewProps
}

export function FilesList(props: FilesListProps) {
	const [open, setOpen] = useState<string | null>(null)
	return (
		<ScrollList
			key='hi'
			data={props.data}
			className='px-4'
			onScroll={e => e.nativeEvent.contentOffset.y === 0}
			showsVerticalScrollIndicator={false}
			refreshableContentProps={{
				onReload: async () => await props.onReload?.(),
			}}
			keyExtractor={file => file.id}
			renderItem={({ item }) => (
				<RenderItem
					item={item}
					{...props}
					onOpenChange={id => id && setOpen(id)}
					open={open}
				/>
			)}
		/>
	)
}

function RenderItem(props: ItemProps) {
	const { item, open, onOpenChange } = props
	const imageStyles = useResolveClassNames('size-15 rounded-lg bg-primary')
	const ref = useRef<SwipeableMethods>(null)

	useEffect(() => {
		const isOpen = open && open === item.id
		if (!isOpen) {
			ref.current?.close?.({})
		}
	}, [open, item.id])

	return (
		<SwipeAbleItem
			ref={ref}
			canSwipeRight={props.canSwipeRigth}
			canSwipeLeft={props.canSwipeLeft}
			onOpenChange={direction =>
				onOpenChange?.(direction !== 0 ? item.id : undefined)
			}
			snap={150}
			leftView={buttonProps => (
				<UnderView
					{...buttonProps}
					viewProps={props.underLeftViewProps}
					content={() => props.underLeftContent?.(item, buttonProps)}
				/>
			)}
			rightView={buttonProps => (
				<UnderView
					{...buttonProps}
					viewProps={props.underRightViewProps}
					content={() => props.underRightContnet?.(item, buttonProps)}
				/>
			)}
		>
			<View className='flex-row gap-4 rounded-2xl p-2'>
				<Image
					style={imageStyles}
					contentFit='cover'
					source={{
						uri: getUri(item.key),
					}}
				/>
				<View className='justify-center'>
					<ThemedText className='font-bold'>{item.name}</ThemedText>
					<ThemedText className='text-muted-foreground'>{item.type}</ThemedText>
				</View>
			</View>
		</SwipeAbleItem>
	)
}

function UnderView({ content, viewProps }: ButtonViewProps) {
	return (
		<ThemedView
			{...viewProps}
			className={cn('h-full w-full bg-primary', viewProps?.className)}
		>
			{content()}
		</ThemedView>
	)
}
