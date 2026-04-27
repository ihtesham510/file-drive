// themed-view.tsx
import { View, type ViewProps } from 'react-native'
import Animated, { type AnimatedProps } from 'react-native-reanimated'
import { cn } from '@/lib/utils'

export function ThemedView({
	animated,
	className,
	...props
}: ViewProps & AnimatedProps<ViewProps> & { animated?: boolean }) {
	const Comp = animated ? Animated.View : View
	return <Comp className={cn('bg-background', className)} {...props} />
}
