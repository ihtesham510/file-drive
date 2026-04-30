import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { Pressable } from 'react-native'
import { useResolveClassNames } from 'uniwind'
import { ScrollList } from '@/components/common/scroll-list'
import { trpc } from '@/utils/trpc'

export default function Page() {
	const files = useQuery(trpc.files.list.queryOptions())
	const imageStyles = useResolveClassNames('h-125 w-full rounded-lg bg-primary')
	return (
		<ScrollList
			data={files.data?.reverse()}
			onScroll={e => e.nativeEvent.contentOffset.y === 0}
			showsVerticalScrollIndicator={false}
			contentContainerClassName='gap-4'
			keyExtractor={file => file.id}
			renderItem={({ item }) => {
				const uri = `https://bfbe-2400-adc7-1950-7000-30e7-f8c8-dfa5-c37.ngrok-free.app/file-drive/${item.key}`
				return (
					<Pressable className='relative w-full items-center justify-center p-4'>
						<Image
							style={imageStyles}
							contentFit='cover'
							source={{
								uri,
							}}
						/>
					</Pressable>
				)
			}}
		/>
	)
}
