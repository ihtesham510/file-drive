/** biome-ignore-all lint/suspicious/noExplicitAny: <style can have type any> */
import { Loading02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native'
import { useEffect } from 'react'
import type { ViewProps } from 'react-native'
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import { useCSSVariable } from 'uniwind'

export function Spinner({ spin = true, style, color, ...rest }: { spin?: boolean; icon?: IconSvgElement; color?: string } & ViewProps) {
	const rotation = useSharedValue(0)
	const iconColor = useCSSVariable('--color-foreground') as string

	useEffect(() => {
		if (spin) {
			rotation.value = withRepeat(withTiming(360, { duration: 1000, easing: Easing.linear }), -1)
		} else {
			cancelAnimation(rotation)
			rotation.value = 0
		}
	}, [rotation, spin])

	const animatedStyle = useAnimatedStyle(() => {
		const externalTransform = Array.isArray(style) ? style.flatMap((s: any) => s?.transform ?? []) : ((style as any)?.transform ?? [])

		return {
			transform: [{ rotate: `${rotation.value}deg` }, ...externalTransform],
		}
	})

	return (
		<Animated.View style={[style, animatedStyle]} {...rest}>
			<HugeiconsIcon icon={rest.icon ?? Loading02Icon} size={34} color={color ?? iconColor} />
		</Animated.View>
	)
}
