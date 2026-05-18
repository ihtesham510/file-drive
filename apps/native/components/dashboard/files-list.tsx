import type { FileSchema } from '@file-drive/db/schema/zod'
import { Image } from 'expo-image'
import { type ReactNode, useCallback, useRef } from 'react'
import { View, type ViewProps } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import {
	type SharedValue,
	useAnimatedReaction,
	useSharedValue,
} from 'react-native-reanimated'
import { runOnJS } from 'react-native-worklets'
import { useResolveClassNames } from 'uniwind'
import { ScrollList } from '@/components/common/scroll-list'
import {
	type ButtonProps,
	type Snap,
	SwipeAbleItem,
	type SwipeableMethods,
} from '@/components/common/swipeable-view'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'
import { cn } from '@/lib/utils'
import { getUri } from '@/utils/uri'

interface FilesListProps {
	data: FileSchema[]
	snaps?: Snap[]
	shouldExpandRight?: (data: FileSchema) => boolean
	shouldExpandLeft?: (data: FileSchema) => boolean
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

interface ItemProps extends Omit<FilesListProps, 'data' | 'onReload'> {
	item: FileSchema
	selected: SharedValue<number>
	index: number
}

interface ButtonViewProps extends ButtonProps {
	shouldExpand?: boolean
	content: () => ReactNode
	viewProps?: ViewProps
	onPress?: () => void
}

export function FilesList({ data, onReload, ...props }: FilesListProps) {
	const selected = useSharedValue<number>(0)
	// biome-ignore lint/correctness/useExhaustiveDependencies: <cannot pass prop as dependecy because they change on revery re-render>
	const renderItem = useCallback(
		({ item, index }: { item: FileSchema; index: number }) => {
			return (
				<RenderItem index={index} item={item} {...props} selected={selected} />
			)
		},
		[selected],
	)
	return (
		<ScrollList
			data={data}
			className='px-4'
			onScroll={e => e.nativeEvent.contentOffset.y === 0}
			showsVerticalScrollIndicator={false}
			refreshableContentProps={{
				onReload: async () => await onReload?.(),
			}}
			keyExtractor={file => file.id}
			renderItem={renderItem}
		/>
	)
}

function RenderItem(props: ItemProps) {
	const { item, index, selected } = props
	const imageStyles = useResolveClassNames('size-15 rounded-lg bg-primary')
	const ref = useRef<SwipeableMethods>(null)
	const shouldExpandLeft = !!props.shouldExpandLeft?.(item)
	const shouldExpandRight = !!props.shouldExpandRight?.(item)

	const close = useCallback(() => {
		ref.current?.close({})
	}, [])

	const open = useCallback(
		(direction: number) => {
			if (direction !== 0) {
				selected.value = index
			}
		},
		[index, selected],
	)

	useAnimatedReaction(
		() => props.selected.value,
		value => {
			if (value !== index) {
				runOnJS(close)()
			}
		},
	)

	const leftView = useCallback(
		(buttonProps: ButtonProps) => (
			<UnderView
				{...buttonProps}
				viewProps={props.underLeftViewProps}
				content={() => props.underLeftContent?.(item, buttonProps)}
				onPress={() => props.onPressLeft?.(item)}
				shouldExpand={shouldExpandLeft}
			/>
		),
		[
			item,
			props.onPressLeft,
			props.underLeftContent,
			props.underLeftViewProps,
			shouldExpandLeft,
		],
	)

	const rightView = useCallback(
		(buttonProps: ButtonProps) => (
			<UnderView
				{...buttonProps}
				viewProps={props.underRightViewProps}
				content={() => props.underRightContnet?.(item, buttonProps)}
				onPress={() => props.onPressRight?.(item)}
				shouldExpand={shouldExpandRight}
			/>
		),
		[
			item,
			props.onPressRight,
			props.underRightContnet,
			props.underRightViewProps,
			shouldExpandRight,
		],
	)

	return (
		<SwipeAbleItem
			className='rounded-lg'
			ref={ref}
			snaps={props.snaps}
			canSwipeRight={props.canSwipeRigth}
			canSwipeLeft={props.canSwipeLeft}
			onOpenChange={open}
			snap={150}
			leftView={leftView}
			rightView={rightView}
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

function UnderView({
	content,
	viewProps,
	shouldExpand,
	...props
}: ButtonViewProps) {
	const jsCallback = useCallback(() => {
		props.onPress?.()
	}, [props.onPress])
	const tap = Gesture.Tap().onEnd(() => {
		const isRight =
			props.state.direction.value !== 0 && props.state.direction.value === -1
		const isLeft =
			props.state.direction.value !== 0 && props.state.direction.value === 1

		if (shouldExpand && props.state.snapPoint.value !== 'full') {
			if (isRight) {
				props.methods.openRight({ snapPoint: 'full' })
				return
			}
			if (isLeft) {
				props.methods.openLeft({ snapPoint: 'full' })
				return
			}
		}
		runOnJS(jsCallback)()
		props.methods.close({})
	})
	return (
		<GestureDetector gesture={tap}>
			<ThemedView
				{...viewProps}
				className={cn('h-full w-full bg-transparent', viewProps?.className)}
			>
				{content()}
			</ThemedView>
		</GestureDetector>
	)
}
