import { useQuery } from '@tanstack/react-query'
import { FlatList } from 'react-native'
import { Container } from '@/components/common/container'
import { RefreshableContent } from '@/components/common/refreshable-content'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'
import { trpc } from '@/utils/trpc'

export default function Page() {
	const files = useQuery(trpc.files.list.queryOptions())
	return (
		<Container>
			<ThemedView className='flex-1 items-center justify-center'>
				<RefreshableContent>
					<FlatList
						data={files.data}
						keyExtractor={file => file.id}
						renderItem={({ item }) => {
							return (
								<ThemedView>
									<ThemedText>{item.name}</ThemedText>
								</ThemedView>
							)
						}}
					/>
				</RefreshableContent>
			</ThemedView>
		</Container>
	)
}
