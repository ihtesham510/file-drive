import { Loading02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import {
	type PropsWithChildren,
	type Ref,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react'
import { PanResponder, type ViewProps, type ViewStyle } from 'react-native'
import {
	cancelAnimation,
	Easing,
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSpring,
	withTiming,
} from 'react-native-reanimated'
import { useCSSVariable } from 'uniwind'
import { ThemedView } from '@/components/common/themed-view'
import { cn } from '@/lib/utils'

const HORIZONTAL_THRESHOLD = 45 // pixels - tolerance for accidental horizontal movement

export interface RefreshableContentHandle {
	addPan: (dy: number) => void
	releasePan: () => Promise<void>
}

export interface RefreshableContentProps extends PropsWithChildren {
	ref?: Ref<RefreshableContentHandle>
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
	ref,
	...props
}: RefreshableContentProps) {
	const MAX_PAN = maxPan
	const THRUST_HOLD = thrustHold

	const panY = useSharedValue(0)
	const hasReleased = useSharedValue(false)
	const rotation = useSharedValue(0)
	const isSpinning = useSharedValue(0)

	const [isSpin, setIsSpin] = useState(false)

	const shouldPanRef = useRef(shouldPan)
	const isReloading = useRef(false)
	const onReloadRef = useRef(props.onReload)
	const maxHorizontalDxRef = useRef(0) // Track max horizontal movement during gesture
	const maxVerticalDyRef = useRef(0) // Track max horizontal movement during gesture

	const resetPan = useCallback(() => {
		isReloading.current = false
		hasReleased.value = true
		isSpinning.value = 0
		panY.value = withSpring(0, { duration: 280 })
		setIsSpin(false)
	}, [hasReleased, isSpinning, panY])

	const setToThrustHold = useCallback(() => {
		hasReleased.value = true
		isSpinning.value = 1
		panY.value = withSpring(THRUST_HOLD, { duration: 280 })
		setIsSpin(true)
	}, [hasReleased, isSpinning, panY, THRUST_HOLD])

	const triggerReload = useCallback(async () => {
		if (isReloading.current) return
		isReloading.current = true
		setToThrustHold()
		await new Promise<void>(res => setTimeout(res, 900))
		try {
			await onReloadRef.current?.()
		} catch (err) {
			console.log(err)
		} finally {
			resetPan()
		}
	}, [setToThrustHold, resetPan])

	useEffect(() => {
		shouldPanRef.current = shouldPan
		resetPan()
	}, [shouldPan, resetPan])

	useEffect(() => {
		onReloadRef.current = props.onReload
	}, [props.onReload])

	useImperativeHandle(
		ref,
		() => ({
			addPan(dy: number) {
				if (isReloading.current) return
				hasReleased.value = false
				isSpinning.value = 0
				panY.value = Math.min(Math.max(0, dy), MAX_PAN)
			},
			async releasePan() {
				if (isReloading.current) return
				if (panY.value >= THRUST_HOLD) {
					await triggerReload()
				} else {
					resetPan()
				}
			},
		}),
		[
			hasReleased,
			isSpinning,
			panY,
			MAX_PAN,
			THRUST_HOLD,
			triggerReload,
			resetPan,
		],
	)

	const panHandlers = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => {
				// Reset horizontal tracking on new gesture start
				maxHorizontalDxRef.current = 0
				return false
			},
			onMoveShouldSetPanResponder: (_e, gestureState) => {
				const { dx, dy } = gestureState
				maxHorizontalDxRef.current = Math.max(
					maxHorizontalDxRef.current,
					Math.abs(dx),
				)
				return (
					shouldPanRef.current &&
					dy > 0 &&
					maxHorizontalDxRef.current < HORIZONTAL_THRESHOLD
				)
			},
			onPanResponderGrant() {
				if (isReloading.current) return
				hasReleased.value = false
				isSpinning.value = 0
			},
			onPanResponderMove(_e, gestureState) {
				if (isReloading.current) return

				// Stop pan if user scrolls horizontally beyond threshold
				if (Math.abs(gestureState.dx) > HORIZONTAL_THRESHOLD) {
					shouldPanRef.current = false
					panY.value = 0
					return
				}

				if (gestureState.dy < MAX_PAN) {
					panY.value = Math.max(0, gestureState.dy)
				}
			},
			async onPanResponderRelease() {
				if (isReloading.current) return
				shouldPanRef.current = true // Re-enable pan for next gesture
				maxHorizontalDxRef.current = 0 // Reset tracking

				if (panY.value >= THRUST_HOLD) {
					await triggerReload()
				} else {
					resetPan()
				}
			},
		}),
	).current

	useEffect(() => {
		if (isSpin) {
			rotation.value = withRepeat(
				withTiming(360, { duration: 1000, easing: Easing.linear }),
				-1,
			)
		} else {
			cancelAnimation(rotation)
			rotation.value = 0
		}
	}, [rotation, isSpin])

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: panY.value }],
	}))

	const iconColor = useCSSVariable('--color-foreground') as string

	const animatedIconContainerStyle = useAnimatedStyle(() => ({
		opacity: panY.value / 100,
		transform: [
			{
				translateY: interpolate(
					panY.value,
					[0, THRUST_HOLD],
					[-THRUST_HOLD / 1.5, 0],
				),
			},
		],
	}))

	const animatedIconStyle = useAnimatedStyle(() => {
		const dragRotation = interpolate(panY.value, [0, THRUST_HOLD], [0, 360])
		const currentRotation =
			isSpinning.value === 0 ? dragRotation : rotation.value
		return {
			transform: [{ rotate: `${currentRotation}deg` }],
		}
	})

	return (
		<ThemedView
			className={cn(
				'relative flex-1 items-center justify-center bg-background',
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
				<ThemedView
					animated
					className='bg-transparent'
					style={animatedIconContainerStyle}
				>
					<ThemedView
						animated
						className='m-0 rounded-full p-0'
						style={animatedIconStyle}
					>
						<HugeiconsIcon icon={Loading02Icon} size={28} color={iconColor} />
					</ThemedView>
				</ThemedView>
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
