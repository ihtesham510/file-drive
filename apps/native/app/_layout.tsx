import '@/global.css'
import { useNetworkState } from 'expo-network'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { AppThemeProvider } from '@/contexts/app-theme-context'
import { authClient } from '@/lib/auth-client'

function StackLayout() {
	const session = authClient.useSession()
	const network = useNetworkState()
	const isConnected = network.isConnected && network.isInternetReachable
	const isAuthenticated =
		!session.isPending && !!session.data?.user && !!isConnected
	console.log(isAuthenticated)

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Protected guard={!isAuthenticated}>
				<Stack.Screen name="(auth)/sign-in" />
			</Stack.Protected>
			<Stack.Protected guard={!isAuthenticated}>
				<Stack.Screen name="(auth)/sign-up" />
			</Stack.Protected>
			<Stack.Protected guard={isAuthenticated}>
				<Stack.Screen name="(authenticated)/dashboard" />
			</Stack.Protected>
			<Stack.Protected guard={!isConnected}>
				<Stack.Screen name="(network)/no-internet" />
			</Stack.Protected>
			<Stack.Protected
				guard={!!network.isConnected && !network.isInternetReachable}
			>
				<Stack.Screen name="(network)/not-connected" />
			</Stack.Protected>
		</Stack>
	)
}

export default function Layout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<KeyboardProvider>
				<AppThemeProvider>
					<StackLayout />
				</AppThemeProvider>
			</KeyboardProvider>
		</GestureHandlerRootView>
	)
}
