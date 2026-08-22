import { Stack } from 'expo-router'
import { Main } from '@/main'

export default function RootLayout() {
	return (
		<Main>
			<Stack>
				<Stack.Screen name='index' options={{ headerShown: false }} />
			</Stack>
		</Main>
	)
}
