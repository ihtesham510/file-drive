import { ReloadIcon } from '@hugeicons/core-free-icons'
import { type PropsWithChildren, useRef, useState } from 'react'
import { PanResponder, type ViewProps, type ViewStyle } from 'react-native'
import {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated'
import { useCSSVariable } from 'uniwind'
import { Spinner } from '@/components/common/spinner'
import { ThemedView } from '@/components/common/themed-view'
import { cn } from '@/utils/tw'

export interface RefreshableContentProps extends PropsWithChildren {
	onReload?: () => Promise<void>
	innerContainerProps?: ViewProps
	outerContainerProps?: ViewProps
	overallStyle?: ViewStyle
	overallclassName?: string
	thrustHold?: number
	maxPan?: number
	shouldPan?: boolean
}

export function RefreshableContent({
	maxPan = 200,
	thrustHold = 120,
	shouldPan = true,
	...props
}: RefreshableContentProps) {
	const MAX_PAN = maxPan
	const THRUST_HOLD = thrustHold
	const panY = useSharedValue(0)
	const hasReleased = useSharedValue(false)
	const spin = useSharedValue(false)
	const [shouldSpin, setShouldSpin] = useState(false)

	const panHandlers = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: (_e, gestureState) => {
				return !!shouldPan && gestureState.dy > 0
			},
			onPanResponderGrant() {
				hasReleased.value = false
			},
			onPanResponderMove(_e, gestureState) {
				if (gestureState.dy < MAX_PAN) {
					panY.value = Math.max(0, gestureState.dy)
				}
			},
			async onPanResponderRelease() {
				if (panY.value >= THRUST_HOLD) {
					setToThrustHold()
					await new Promise(res => setTimeout(res, 900))
					try {
						await props.onReload?.()
					} catch (_err) {
						console.log(_err)
					} finally {
						resetPan()
					}
				} else {
					resetPan()
				}
			},
		}),
	).current

	function resetPan() {
		hasReleased.value = true
		panY.value = withSpring(0, { duration: 280 })
		spin.value = false
		setShouldSpin(false)
	}

	function setToThrustHold() {
		hasReleased.value = true
		spin.value = true
		setShouldSpin(true)
		panY.value = withSpring(THRUST_HOLD, { duration: 280 })
	}

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{
				translateY: panY.value,
			},
		],
	}))

	const animatedContentStyle = useAnimatedStyle(() => ({
		opacity: panY.value / 100,
		transform: [
			{
				translateY: interpolate(panY.value, [0, THRUST_HOLD], [-35, 0]),
			},
		],
	}))

	const iconColor = useCSSVariable('--color-foreground') as string

	return (
		<ThemedView
			className={cn(
				'relative flex-1 items-center justify-center bg-background', // add flex-1 here
				props.outerContainerProps?.className,
				props.overallclassName,
			)}
			{...props.outerContainerProps}
			style={[props.overallStyle]}
		>
			<ThemedView
				className='absolute top-0 items-center justify-center gap-2 bg-transparent'
				style={{ minHeight: THRUST_HOLD }}
			>
				<Spinner
					spin={shouldSpin}
					style={animatedContentStyle}
					icon={ReloadIcon}
					color={iconColor}
				/>
			</ThemedView>
			<ThemedView
				style={[animatedStyle, props.overallStyle]}
				animated
				className={cn(
					'w-full flex-1',
					props.innerContainerProps?.className,
					props?.overallclassName,
				)}
				{...panHandlers.panHandlers}
				{...props.innerContainerProps}
			>
				{props.children}
			</ThemedView>
		</ThemedView>
	)
}
