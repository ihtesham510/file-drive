import { RefreshableContent } from '@/components/common/refreshable-content'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'

export default function Page() {
	return (
		<RefreshableContent>
			<ThemedView className='flex-1 items-center justify-center'>
				<ThemedText>shared</ThemedText>
			</ThemedView>
		</RefreshableContent>
	)
}
