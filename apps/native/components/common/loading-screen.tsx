import { Spinner } from './spinner'
import { ThemedSafeAreaView } from './themed-safe-area-view'
import { ThemedView } from './themed-view'

export function LoadingScreen() {
	return (
		<ThemedSafeAreaView>
			<ThemedView className='flex-1 items-center justify-center px-4'>
				<Spinner />
			</ThemedView>
		</ThemedSafeAreaView>
	)
}
