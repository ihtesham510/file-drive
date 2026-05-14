import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native'
import { View, type ViewProps } from 'react-native'
import Animated, {
	interpolate,
	useAnimatedStyle,
} from 'react-native-reanimated'
import type { ButtonProps } from '@/components/common/swipeable-view'
import { ThemedText } from '@/components/common/themed-text'
import { cn } from '@/lib/utils'

export function RenderUnderIcon({
	offset = 8,
	...props
}: {
	textProps?: React.ComponentProps<typeof ThemedText>
	viewProps?: ViewProps
	icon: IconSvgElement
	text: string
	buttonProps: ButtonProps
	snapPoint: number
	offset?: number
	iconColor?: string
	side: 'left' | 'right'
}) {
	const { translateX, contentWidth } = props.buttonProps.state

	const isLeft = props.side === 'left'

	const textStyle = useAnimatedStyle(() => {
		return {
			opacity: interpolate(
				Math.abs(translateX.value),
				[props.snapPoint, contentWidth],
				[0, 1],
				'clamp',
			),
			width: isLeft
				? translateX.value > props.snapPoint
					? 'auto'
					: 0
				: translateX.value < -props.snapPoint
					? 'auto'
					: 0,
			overflow: 'hidden',
		}
	})

	const iconStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: interpolate(
						Math.abs(translateX.value),
						[props.snapPoint, contentWidth],
						[0, -offset],
						'clamp',
					),
				},
			],
		}
	})
	return (
		<View
			{...props.viewProps}
			className={cn(
				'mx-1 h-full flex-1 flex-row items-center justify-center rounded-lg',
				props.viewProps?.className,
			)}
		>
			<Animated.View style={iconStyle}>
				<HugeiconsIcon icon={props.icon} size={28} />
			</Animated.View>
			<ThemedText
				{...props.textProps}
				animated
				style={textStyle}
				className={cn('font-bold', props.textProps?.className)}
			>
				{props.text}
			</ThemedText>
		</View>
	)
}
