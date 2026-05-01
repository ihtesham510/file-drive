import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { FlatList } from 'react-native'
import { useResolveClassNames } from 'uniwind'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'
import { trpc } from '@/utils/trpc'
import { getUri } from '@/utils/uri'

export default function Page() {
	const files = useQuery(trpc.files.list.queryOptions())
	const imageStyle = useResolveClassNames('size-32 rounded-md bg-primary')
	return (
		<ThemedView className='flex-1 gap-2'>
			<ThemedView className='flex-row items-center justify-between px-4.5'>
				<ThemedText varient='title'>Recents</ThemedText>
				<Link href='/dashboard/files'>
					<ThemedText className='text-lg'>see all</ThemedText>
				</Link>
			</ThemedView>
			<FlatList
				data={files.data}
				style={{ flexGrow: 0 }}
				horizontal
				keyExtractor={item => item.id}
				contentContainerClassName='gap-2 px-4.5'
				showsHorizontalScrollIndicator={false}
				renderItem={({ item }) => {
					const uri = getUri(item.key)
					return (
						<ThemedView className='items-start justify-center'>
							<Image
								style={imageStyle}
								source={{
									uri,
								}}
							/>
						</ThemedView>
					)
				}}
			/>
		</ThemedView>
	)
}
