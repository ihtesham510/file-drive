import { useState } from 'react'
import { FlatList, type FlatListProps } from 'react-native'
import {
	RefreshableContent,
	type RefreshableContentProps,
} from '@/components/common/refreshable-content'

interface Props<T> extends FlatListProps<T> {
	refreshableContentProps?: RefreshableContentProps
}
export function ScrollList<T>(props: Props<T>) {
	const [isOnTop, setIsOnTop] = useState(false)
	return (
		<RefreshableContent {...props.refreshableContentProps} shouldPan={isOnTop}>
			<FlatList
				{...props}
				onScroll={e => {
					setIsOnTop(e.nativeEvent.contentOffset.y === 0)
				}}
			/>
		</RefreshableContent>
	)
}
