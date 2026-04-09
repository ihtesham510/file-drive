import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { authClient } from '@/lib/auth-client'
import { Main } from '@/main'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const session = authClient.useSession()

	const authenticated = !session.isPending && !!session.data?.user

	useEffect(() => {
		if (session.isPending) {
			SplashScreen.hide()
		}
	}, [session.isPending])
	return (
		<Main>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Protected guard={!authenticated}>
					<Stack.Screen name='index' />
				</Stack.Protected>
				<Stack.Protected guard={authenticated}>
					<Stack.Screen name='dashboard' />
				</Stack.Protected>
				<Stack.Protected guard={!authenticated}>
					<Stack.Screen name='(auth)/sign-in' />
				</Stack.Protected>

				<Stack.Protected guard={!authenticated}>
					<Stack.Screen name='(auth)/sign-up' />
				</Stack.Protected>
			</Stack>
		</Main>
	)
}
