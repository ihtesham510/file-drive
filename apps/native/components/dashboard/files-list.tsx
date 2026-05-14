import type { FileSchema } from '@file-drive/db/schema/zod'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native'
import { Image } from 'expo-image'
import { useEffect, useRef, useState } from 'react'
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
import { getUri } from '@/utils/uri'

interface FilesListProps {
	data: FileSchema[]
	onReload?: () => Promise<void>
	underRightIcon: (data: FileSchema) => IconSvgElement
	underLeftIcon: (data: FileSchema) => IconSvgElement
	canSwipeRigth?: boolean
	canSwipeLeft?: boolean
	onSwipeRight?: (item: FileSchema) => void
	onSwipeLeft?: (item: FileSchema) => void
	underRightView?: ViewProps
	underLeftView?: ViewProps
}

interface ItemProps extends FilesListProps {
	item: FileSchema
	open?: string | null
	onOpenChange?: (id?: string) => void
}

interface ButtonViewProps extends ButtonProps {
	icon: IconSvgElement
}

export function FilesList(props: FilesListProps) {
	const [open, setOpen] = useState<string | null>(null)
	return (
		<ScrollList
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

function RenderItem({ item, open, onOpenChange, ...props }: ItemProps) {
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
			onOpenChange={direction =>
				onOpenChange?.(direction !== 0 ? item.id : undefined)
			}
			snap={150}
			canSwipeLeft={false}
			rightView={viewProps => (
				<RightView {...viewProps} icon={props.underRightIcon(item)} />
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

function LeftView({ progress, methods, icon }: ButtonViewProps) {
	const iconColor = useCSSVariable('--color-primary-foreground') as string
	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					scale: interpolate(progress.value, [0, 150], [0, 1], 'clamp'),
				},
			],
		}
	})
	const tap = Gesture.Tap()
		.runOnJS(true)
		.onEnd(() =>
			methods.openLeft?.({
				snapPoint: 'full',
			}),
		)

	return (
		<ThemedView className='h-full w-full items-center justify-center bg-transparent'>
			<GestureDetector gesture={tap}>
				<ThemedView
					animated
					style={animatedStyle}
					className='w-full items-center justify-center rounded-2xl bg-primary px-6 py-4'
				>
					<HugeiconsIcon color={iconColor} icon={icon} size={38} />
				</ThemedView>
			</GestureDetector>
		</ThemedView>
	)
}

function RightView({
	progress,
	methods,
	icon,
	state: { snapPoint },
}: ButtonViewProps) {
	const button1Selected = useSharedValue(false)
	const button2Selected = useSharedValue(false)

	const animatedStyleOne = useAnimatedStyle(() => {
		if (snapPoint.value === 'full' && !button1Selected.value) {
			return {
				transform: [{ scale: 0 }],
			}
		}
		return {
			transform: [
				{
					scale: interpolate(progress.value, [-150, 0], [1, 0], 'clamp'),
				},
			],
		}
	})
	const animatedStyleTwo = useAnimatedStyle(() => {
		if (snapPoint.value === 'full' && !button2Selected.value) {
			return {
				transform: [{ scale: 0 }],
			}
		}
		return {
			transform: [
				{
					scale: interpolate(progress.value, [-150, 0], [1, 0], 'clamp'),
				},
			],
		}
	})
	const iconColor = useCSSVariable('--color-primary-foreground') as string
	const tapButton1 = Gesture.Tap().onEnd(() => {
		if (methods.openRight && methods.close) {
			if (snapPoint.value === 'full') {
				runOnJS(methods.close)({})
				button1Selected.value = false
			} else {
				button1Selected.value = true
				runOnJS(methods.openRight)({
					snapPoint: 'full',
				})
			}
		}
	})
	const tapButton2 = Gesture.Tap().onEnd(() => {
		if (methods.openRight && methods.close) {
			if (snapPoint.value === 'full') {
				runOnJS(methods.close)({})
				button2Selected.value = false
			} else {
				button2Selected.value = true
				runOnJS(methods.openRight)({
					snapPoint: 'full',
				})
			}
		}
	})
	return (
		<ThemedView className='h-full w-full flex-row items-center justify-center bg-transparent'>
			<GestureDetector gesture={tapButton1}>
				<ThemedView
					animated
					className='m-1 h-full w-[48%] items-center justify-center rounded-2xl bg-primary'
					style={animatedStyleOne}
				>
					<HugeiconsIcon color={iconColor} icon={icon} size={28} />
				</ThemedView>
			</GestureDetector>

			<GestureDetector gesture={tapButton2}>
				<ThemedView
					animated
					className='m-1 h-full w-[48%] items-center justify-center rounded-2xl bg-primary'
					style={animatedStyleTwo}
				>
					<HugeiconsIcon color={iconColor} icon={icon} size={28} />
				</ThemedView>
			</GestureDetector>
		</ThemedView>
	)
}
