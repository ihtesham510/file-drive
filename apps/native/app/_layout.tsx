import '@/global.css'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { QueryClientProvider } from '@tanstack/react-query'
import { useNetworkState } from 'expo-network'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { Uniwind } from 'uniwind'
import { AppThemeProvider } from '@/contexts/app-theme-context'
import { authClient } from '@/lib/auth-client'
import { queryClient } from '@/utils/queryClient'

Uniwind.setTheme('dark')

function StackLayout() {
	const session = authClient.useSession()
	const network = useNetworkState()
	const isProperlyConnected =
		!!network.isConnected && !!network.isInternetReachable
	const isAuthenticated =
		!session.isPending && !!session.data?.user && isProperlyConnected

	return (
		<>
			<StatusBar style='light' animated />
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Protected guard={!isAuthenticated}>
					<Stack.Screen name='(auth)/sign-in' />
				</Stack.Protected>
				<Stack.Protected guard={!isAuthenticated}>
					<Stack.Screen name='(auth)/sign-up' />
				</Stack.Protected>
				<Stack.Protected guard={isAuthenticated}>
					<Stack.Screen name='(authenticated)/dashboard' />
				</Stack.Protected>
				<Stack.Protected guard={!isProperlyConnected}>
					<Stack.Screen name='(network)/no-internet' />
				</Stack.Protected>
				<Stack.Protected guard={!network.isConnected}>
					<Stack.Screen name='(network)/not-connected' />
				</Stack.Protected>
			</Stack>
		</>
	)
}

export default function Layout() {
	return (
		<QueryClientProvider client={queryClient}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<KeyboardProvider>
					<BottomSheetModalProvider>
						<AppThemeProvider>
							<StackLayout />
						</AppThemeProvider>
					</BottomSheetModalProvider>
				</KeyboardProvider>
			</GestureHandlerRootView>
		</QueryClientProvider>
	)
}
