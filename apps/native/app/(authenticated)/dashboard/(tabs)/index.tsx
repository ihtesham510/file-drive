import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { FlatList, Pressable } from 'react-native'
import { useResolveClassNames } from 'uniwind'
import { Container } from '@/components/common/container'
import { trpc } from '@/utils/trpc'

export default function Page() {
	const files = useQuery(trpc.files.list.queryOptions())
	const imageStyles = useResolveClassNames(
		'h-125 w-[90%] rounded-lg bg-primary',
	)
	return (
		<Container>
			<FlatList
				data={files.data}
				keyExtractor={file => file.id}
				renderItem={({ item }) => {
					const uri = `http://192.168.1.3:7000/file-drive/${item.key}`
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
