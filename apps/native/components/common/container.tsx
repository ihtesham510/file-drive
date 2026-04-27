import type { PropsWithChildren } from 'react'
import type { ViewProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ThemedView } from '@/components/common/themed-view'
import { cn } from '@/lib/utils'

interface Props extends ViewProps {
	bottom?: boolean
	top?: boolean
}
export function Container({
	children,
	top = true,
	bottom = false,
	...props
}: PropsWithChildren<Props>) {
	const insets = useSafeAreaInsets()

	return (
		<ThemedView
			className={cn('flex-1 bg-background', props.className)}
			style={{
				paddingTop: top ? insets.top : 0,
				paddingBottom: bottom ? insets.bottom : 0,
			}}
			{...props}
		>
			{children}
		</ThemedView>
	)
}
