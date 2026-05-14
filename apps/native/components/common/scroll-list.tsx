import { useState } from 'react'
import type { FlatListProps } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { LinearTransition } from 'react-native-reanimated'
import {
	RefreshableContent,
	type RefreshableContentProps,
} from '@/components/common/refreshable-content'

interface Props<T> extends FlatListProps<T> {
	refreshableContentProps?: RefreshableContentProps
}

export function ScrollList<T>({ refreshableContentProps, ...props }: Props<T>) {
	const [isOnTop, setIsOnTop] = useState(false)

	return (
		<RefreshableContent
			{...refreshableContentProps}
			shouldPan={isOnTop && refreshableContentProps?.shouldPan}
		>
			<FlatList
				// biome-ignore lint/suspicious/noExplicitAny: <Cannot define the props types for Animated.FlatList so use any>
				{...(props as any)}
				itemLayoutAnimation={LinearTransition.springify()}
				skipEnteringExitingAnimations
				overScrollMode='never'
				bounces={false}
				scrollEventThrottle={16}
				onScroll={e => {
					setIsOnTop(e.nativeEvent.contentOffset.y === 0)
					props.onScroll?.(e)
				}}
			/>
		</RefreshableContent>
	)
}
