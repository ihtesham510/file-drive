import { Container } from '@/components/common/container'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'

export default function Page() {
	return (
		<Container>
			<ThemedView className='flex-1 items-center justify-center'>
				<ThemedText>Home</ThemedText>
			</ThemedView>
		</Container>
	)
}
