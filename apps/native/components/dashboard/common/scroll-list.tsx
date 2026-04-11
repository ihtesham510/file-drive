import { ReloadIcon } from '@hugeicons/core-free-icons'
import { useRef, useState } from 'react'
import { FlatList, type FlatListProps, PanResponder, type ViewProps } from 'react-native'
import { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useCSSVariable } from 'uniwind'
import { Spinner } from '@/components/common/spinner'
import { ThemedView } from '@/components/common/themed-view'
import { cn } from '@/utils/tw'

const THRUST_HOLD = 120
const MAX_PAN = 200

interface Props<T> extends FlatListProps<T> {
	onReload?: () => Promise<void>
	innerContainerProps?: ViewProps
	outerContainerProps?: ViewProps
}

export function ScrollList<T>(props: Props<T>) {
	const scrollY = useRef(0)
	const panY = useSharedValue(0)
	const hasReleased = useSharedValue(false)
	const spin = useSharedValue(false)
	const [shouldSpin, setShouldSpin] = useState(false)

	const panHandlers = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: (_e, gestureState) => {
				return scrollY.current <= 0 && gestureState.dy > 0
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
					props.onReload?.().finally(() => resetPan())
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
		top: panY.value,
	}))

	const animatedContentStyle = useAnimatedStyle(() => ({
		opacity: panY.value / 100,
		top: interpolate(panY.value, [0, THRUST_HOLD], [-35, 0]),
	}))

	const iconColor = useCSSVariable('--color-primary-foreground') as string

	return (
		<ThemedView
			className={cn('relative w-full items-center justify-center bg-primary', props.outerContainerProps?.className)}
			{...props.outerContainerProps}
		>
			<ThemedView className='absolute top-0 items-center justify-center gap-2 bg-transparent' style={{ minHeight: THRUST_HOLD }}>
				<Spinner spin={shouldSpin} style={animatedContentStyle} icon={ReloadIcon} color={iconColor} />
			</ThemedView>
			<ThemedView
				style={animatedStyle}
				animated
				className={cn('w-full', props.innerContainerProps?.className)}
				{...panHandlers.panHandlers}
				{...props.innerContainerProps}
			>
				<FlatList
					{...props}
					scrollEventThrottle={16}
					onScroll={e => {
						scrollY.current = e.nativeEvent.contentOffset.y
					}}
				/>
			</ThemedView>
		</ThemedView>
	)
}
