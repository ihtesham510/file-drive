import { View, type ViewProps } from 'react-native'
import Animated from 'react-native-reanimated'
import { cn } from '@/utils/tw'

export function ThemedView({ animated, className, ...props }: ViewProps & { animated?: boolean }) {
	const Comp = animated ? Animated.View : View
	return <Comp className={cn('bg-background', className)} {...props} />
}
