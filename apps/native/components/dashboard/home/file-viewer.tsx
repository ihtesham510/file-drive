import type { Doc } from '@repo/convex/models'
import type { WithoutSystemFields } from 'convex/server'
import { Image } from 'expo-image'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { ThemedView } from '@/components/common/themed-view'
import { ScrollList } from '@/components/dashboard/common/scroll-list'

interface Props {
	files: WithoutSystemFields<Doc<'file'>>[]
	onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

export function FileView({ files, onScroll }: Props) {
	return (
		<ScrollList
			data={files}
			contentContainerClassName='space-y-1 space-x-1'
			showsVerticalScrollIndicator={false}
			onReload={async () => {
				await new Promise(res => setTimeout(res, 1000))
			}}
			onScroll={onScroll}
			showsHorizontalScrollIndicator={false}
			renderItem={({ item }) => {
				return (
					<ThemedView className='min-h-100 flex-1 items-center justify-center bg-secondary'>
						<Image source={{ uri: item.data.url }} contentFit='cover' style={{ width: '100%', height: 400 }} />
					</ThemedView>
				)
			}}
		/>
	)
}
