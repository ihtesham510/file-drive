import type { TextProps } from 'react-native'
import { Text } from 'react-native'
import Animated from 'react-native-reanimated'
import { cn } from '@/utils/tw'

export function ThemedText({
	varient = 'default',
	className,
	animated = false,
	...props
}: TextProps & {
	varient?: 'default' | 'bold' | 'semiBold' | 'title'
	animated?: boolean
}) {
	const Comp = animated ? Animated.Text : Text
	return <Comp className={cn('text-foreground', varients[varient], className)} {...props} />
}

const varients = {
	default: 'leading-8',
	bold: 'font-bold leading-8',
	semiBold: 'fold-semibold leading-8',
	title: 'text-2xl font-bold',
}
