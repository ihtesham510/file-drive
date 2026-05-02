import { type PropsWithChildren, useRef, useState } from 'react'
import { PanResponder, View, type ViewProps } from 'react-native'
import Animated, {
	type AnimatedProps,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated'

interface Props extends PropsWithChildren {
	underViewProps?: ViewProps
	viewProps?: ViewProps
	contentViewProps?: AnimatedProps<ViewProps>
	thrustHold?: number
	maxThrust?: number
	underView?: React.ReactNode
	onSwipeRight?: (reset: () => void) => void
	onSwipeLeft?: (reset: () => void) => void
}

export function SwipeAbleView(props: Props) {
	const { style: viewStyle, ...viewRestProps } = props.viewProps ?? {}
	const { style: underViewStyle, ...underViewRestProps } =
		props.underViewProps ?? {}
	const { style: contentViewStyle, ...contentViewRestProps } =
		props.contentViewProps ?? {}

	const [contentSize, setContentSize] = useState<{
		width: number
		height: number
	}>()
	const thrustHold = props.thrustHold ?? 80
	const maxThrust = props.maxThrust ?? 120
	const x = useSharedValue(0)

	function reset() {
		x.value = withSpring(0, {})
	}

	const panHandlers = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder(_e, gestureState) {
				return (
					Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
					Math.abs(gestureState.dy) <= 25
				)
			},
			onPanResponderMove(_e, gestureState) {
				if (Math.abs(gestureState.dx) <= maxThrust) {
					x.value = gestureState.dx
				}
			},
			onPanResponderRelease() {
				if (x.value >= thrustHold) {
					props.onSwipeLeft?.(reset)
				} else if (x.value <= -thrustHold) {
					props.onSwipeRight?.(reset)
				}
				reset()
			},
		}),
	).current

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: x.value }],
	}))

	return (
		<View {...viewRestProps} style={[viewStyle, { position: 'relative' }]}>
			{contentSize && (
				<View
					style={[
						{
							position: 'absolute',
							top: 0,
							height: contentSize.height,
							width: contentSize.width,
						},
						underViewStyle,
					]}
					{...underViewRestProps}
				>
					{props.underView}
				</View>
			)}
			<Animated.View
				{...contentViewRestProps}
				onLayout={e =>
					setContentSize({
						height: e.nativeEvent.layout.height,
						width: e.nativeEvent.layout.width,
					})
				}
				style={[contentViewStyle, animatedStyle]}
				{...panHandlers.panHandlers}
			>
				{props.children}
			</Animated.View>
		</View>
	)
}
