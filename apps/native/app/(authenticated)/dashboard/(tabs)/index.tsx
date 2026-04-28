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
				keyExtractor={file => file.id}
				renderItem={({ item }) => {
					const uri = `https://36e9-2400-adc7-1950-7000-b40e-5cc9-a524-f6c5.ngrok-free.app/file-drive/${item.key}`
					console.log(uri)
					return (
						<Pressable className='relative my-4 w-full items-center justify-center'>
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
