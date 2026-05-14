import { useState } from 'react'
import type { FlatListProps } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
	RefreshableContent,
	type RefreshableContentProps,
} from '@/components/common/refreshable-content'
import { Spinner } from '@/components/common/spinner'
import { ThemedView } from '@/components/common/themed-view'

interface Props<T> extends FlatListProps<T> {
	refreshableContentProps?: RefreshableContentProps
	isLoadingMore?: boolean
}

export function ScrollList<T>({
	refreshableContentProps,
	isLoadingMore,
	...props
}: Props<T>) {
	const [isOnTop, setIsOnTop] = useState(false)

	const insets = useSafeAreaInsets()
	return (
		<ThemedView style={{ paddingBottom: insets.bottom, flex: 1 }}>
			<RefreshableContent
				{...refreshableContentProps}
				shouldPan={isOnTop && refreshableContentProps?.shouldPan}
			>
				<Animated.FlatList
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
					ListFooterComponent={() => {
						return (
							<ThemedView className='h-28 flex-1 items-center justify-center'>
								{isLoadingMore && <Spinner />}
							</ThemedView>
						)
					}}
				/>
			</RefreshableContent>
		</ThemedView>
	)
}
