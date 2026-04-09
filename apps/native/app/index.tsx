import { router } from 'expo-router'
import { Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'

export default function Index() {
	return (
		<SafeAreaView className='flex-1 bg-background'>
			<ThemedView className='flex-1 items-center justify-between bg-green-400'>
				<Pressable onPress={() => router.push('/sign-in')}>
					<ThemedView className='h-56 w-full items-center justify-center bg-red-300'>
						<ThemedText>hellow world</ThemedText>
					</ThemedView>
				</Pressable>
			</ThemedView>
		</SafeAreaView>
	)
}
