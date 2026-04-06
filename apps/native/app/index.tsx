import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'

export default function Index() {
	return (
		<ThemedView className='flex-1 items-center justify-center bg-red-300'>
			<ThemedText>Edit app/index.tsx to edit this screen.</ThemedText>
		</ThemedView>
	)
}
