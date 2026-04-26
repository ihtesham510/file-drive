/** biome-ignore-all lint/suspicious/noExplicitAny: <style can have type any> */
import { Loading02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native'
import { useEffect } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import Animated, {
	cancelAnimation,
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from 'react-native-reanimated'
import { useCSSVariable } from 'uniwind'

const AnimatedIcon = Animated.createAnimatedComponent(HugeiconsIcon)

interface SpinnerProps {
	spin?: boolean
	style?: StyleProp<ViewStyle>
	color?: string
	icon?: IconSvgElement
	size?: number
}

export function Spinner({
	spin = true,
	style,
	color,
	icon,
	size,
}: SpinnerProps) {
	const rotation = useSharedValue(0)
	const iconColor = useCSSVariable('--color-foreground') as string

	useEffect(() => {
		if (spin) {
			rotation.value = withRepeat(
				withTiming(360, { duration: 1000, easing: Easing.linear }),
				-1,
			)
		} else {
			cancelAnimation(rotation)
			rotation.value = 0
		}
	}, [rotation, spin])

	const animatedStyle = useAnimatedStyle(() => {
		const externalTransform = Array.isArray(style)
			? style.flatMap((s: any) => s?.transform ?? [])
			: ((style as any)?.transform ?? [])

		return {
			transform: [{ rotate: `${rotation.value}deg` }, ...externalTransform],
		}
	})

	return (
		<AnimatedIcon
			icon={icon ?? Loading02Icon}
			color={color ?? iconColor}
			size={size}
			style={[style, animatedStyle]}
		/>
	)
}
