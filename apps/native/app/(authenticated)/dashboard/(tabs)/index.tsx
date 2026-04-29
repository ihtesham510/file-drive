import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { Pressable } from 'react-native'
import { useResolveClassNames } from 'uniwind'
import { Container } from '@/components/common/container'
import { ScrollList } from '@/components/common/scroll-list'
import { trpc } from '@/utils/trpc'

export default function Page() {
	const files = useQuery(trpc.files.list.queryOptions())
	const imageStyles = useResolveClassNames(
		'h-125 w-[90%] rounded-lg bg-primary',
	)
	return (
		<Container>
			<ScrollList
				data={files.data?.reverse()}
				onScroll={e => e.nativeEvent.contentOffset.y === 0}
				showsVerticalScrollIndicator={false}
				contentContainerClassName='gap-4'
				keyExtractor={file => file.id}
				renderItem={({ item }) => {
					const uri = `https://f80b-2400-adc7-1950-7000-eca3-b772-d7c0-dbdd.ngrok-free.app/file-drive/${item.key}`
					console.log(uri)
					return (
						<Pressable className='relative w-full items-center justify-center'>
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
		</Container>
	)
}
