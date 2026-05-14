import {
	type PropsWithChildren,
	type RefObject,
	useCallback,
	useImperativeHandle,
	useState,
} from 'react'
import { View } from 'react-native'
import {
	Gesture,
	GestureDetector,
	type GestureUpdateEvent,
	type PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler'
import Animated, {
	interpolate,
	interpolateColor,
	type SharedValue,
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated'
import { runOnJS } from 'react-native-worklets'
import { useCSSVariable } from 'uniwind'

type Fn<T = Record<string, string>> = (args: T) => void
export type Snap = number | 'full'
export type OpeningArgs = { snapPoint?: Snap }

export interface SwipeableMethods {
	openRight: Fn<OpeningArgs>
	openLeft: Fn<OpeningArgs>
	close: Fn
	open: SharedValue<boolean>
}

export type ButtonProps = {
	state: {
		snapPoint: SharedValue<Snap>
		direction: SharedValue<number>
		translateX: SharedValue<number>
	}
	methods: SwipeableMethods
}

interface Props extends PropsWithChildren {
	ref?: RefObject<SwipeableMethods | null>
	onOpenChange?: (direction: number) => void
	sensitivity?: number
	thrustHold?: number
	snap?: number
	snaps?: Snap | Array<Snap>
	rightSnap?: number
	leftSnap?: number
	leftView?: (props: ButtonProps) => React.ReactNode
	rightView?: (props: ButtonProps) => React.ReactNode
	canSwipeRight?: boolean
	canSwipeLeft?: boolean
}

const SPRING_CONFIG = { duration: 200 }

export function SwipeAbleItem({
	ref,
	onOpenChange,
	sensitivity = 800,
	thrustHold = 80,
	snap,
	snaps,
	leftSnap,
	rightSnap,
	leftView,
	rightView,
	canSwipeLeft = true,
	canSwipeRight = true,
	children,
}: Props) {
	const [contentWidth, setContentWidth] = useState(0)
	const [backgroundColor, cardColor] = useCSSVariable([
		'--color-background',
		'--color-card',
	]) as string[]

	const translateX = useSharedValue<number>(0)
	const offsetX = useSharedValue<number>(0)
	const direction = useSharedValue<number>(0)
	const snapPoint = useSharedValue<Snap>(0)
	const open = useSharedValue<boolean>(false)

	useAnimatedReaction(
		() => ({
			dir: direction.value,
			x: direction.value,
		}),
		({ dir, x }) => {
			if (onOpenChange) {
				runOnJS(onOpenChange)(dir)
			}
			open.value = dir !== 0
			if (x === contentWidth) {
				snapPoint.value = 'full'
			} else {
				snapPoint.value = x
			}
		},
	)

	const reset = useCallback(() => {
		'worklet'
		translateX.value = withSpring(0, SPRING_CONFIG)
		direction.value = 0
	}, [translateX, direction])

	const openLeft = useCallback(
		(args: OpeningArgs) => {
			'worklet'
			if (args.snapPoint === 'full') {
				direction.value = 1
				translateX.value = withSpring(contentWidth, SPRING_CONFIG)
			}
		},
		[contentWidth, direction, translateX],
	)

	const openRight = useCallback(
		(args: OpeningArgs) => {
			'worklet'
			if (args.snapPoint === 'full') {
				direction.value = -1
				translateX.value = withSpring(-contentWidth, SPRING_CONFIG)
			}
		},
		[contentWidth, direction, translateX],
	)

	const buttonProps: ButtonProps = {
		state: {
			snapPoint,
			direction,
			translateX,
		},
		methods: {
			open,
			close: reset,
			openLeft,
			openRight,
		},
	}

	useImperativeHandle(ref, () => buttonProps.methods)

	const rightSideSnap = rightSnap ?? snap ?? contentWidth
	const leftSideSnap = leftSnap ?? snap ?? contentWidth

	function handleUpdate(e: GestureUpdateEvent<PanGestureHandlerEventPayload>) {
		const isPositive = Math.sign(e.translationX) === 1
		const isNegative = Math.sign(e.translationX) === -1
		const canPan = (isNegative && canSwipeRight) || (isPositive && canSwipeLeft)
		if (!canPan) return
		translateX.value = offsetX.value + e.translationX
	}

	function handleEnd(e: GestureUpdateEvent<PanGestureHandlerEventPayload>) {
		const vel = e.velocityX
		let _snapPoint: Snap | undefined
		const translation = e.translationX
		const isLeft =
			(translation < -thrustHold || vel < -sensitivity) && canSwipeRight
		const isRight =
			(translation > thrustHold || vel > sensitivity) && canSwipeLeft
		if (Array.isArray(snaps)) {
			for (const snap of snaps) {
				if (snap === 'full') {
					_snapPoint = contentWidth
				} else {
					if (Math.abs(direction.value)) {
					}
				}
			}
		}

		if (isRight) {
			if (direction.value === -1) {
				translateX.value = withSpring(0, SPRING_CONFIG)
				direction.value = 0
				return
			}
			translateX.value = withSpring(rightSideSnap, SPRING_CONFIG)
			direction.value = 1
			return
		}
		if (isLeft) {
			if (direction.value === 1) {
				translateX.value = withSpring(0, SPRING_CONFIG)
				direction.value = 0
				return
			}
			direction.value = -1
			translateX.value = withSpring(-leftSideSnap, SPRING_CONFIG)
			return
		}
		direction.value = 0
		translateX.value = withSpring(0, SPRING_CONFIG)
	}

	const panGesture = Gesture.Pan()
		.activeOffsetX([-10, 10])
		.failOffsetY([-8, 8])
		.onStart(() => {
			offsetX.value = translateX.value
		})
		.onUpdate(handleUpdate)
		.onEnd(handleEnd)

	const mainStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.value }],
		backgroundColor: interpolateColor(
			translateX.value,
			[-thrustHold, 0, thrustHold],
			[cardColor, backgroundColor, cardColor],
		),
	}))
	const leftStyle = useAnimatedStyle(() => {
		const w = interpolate(
			translateX.value,
			[0, leftSideSnap],
			[0, leftSideSnap],
		)
		return {
			width: w,
			opacity: interpolate(translateX.value, [0, thrustHold], [0, 1], 'clamp'),
		}
	})

	const rightStyle = useAnimatedStyle(() => {
		const w = interpolate(
			translateX.value,
			[-rightSideSnap, 0],
			[rightSideSnap, 0],
		)
		return {
			width: w,
			opacity: interpolate(translateX.value, [-thrustHold, 0], [1, 0], 'clamp'),
		}
	})

	return (
		<GestureDetector gesture={panGesture}>
			<View onLayout={e => setContentWidth(e.nativeEvent.layout.width)}>
				<View style={{ position: 'relative' }}>
					{leftView && (
						<Animated.View
							style={[
								{
									position: 'absolute',
									top: 0,
									left: 0,
									bottom: 0,
									width: '100%',
								},
								leftStyle,
							]}
						>
							{leftView(buttonProps)}
						</Animated.View>
					)}

					{rightView && (
						<Animated.View
							style={[
								{
									position: 'absolute',
									top: 0,
									right: 0,
									bottom: 0,
									width: '100%',
								},
								rightStyle,
							]}
						>
							{rightView(buttonProps)}
						</Animated.View>
					)}

					<Animated.View style={[mainStyle, { width: '100%' }]}>
						{children}
					</Animated.View>
				</View>
			</View>
		</GestureDetector>
	)
}
