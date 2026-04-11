import type { PropsWithChildren } from 'react'
import './global.css'
import { NotificationContextProvider } from '@/context/notification-context'

import 'react-native-reanimated'

import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { withUniwind } from 'uniwind'
import { authClient } from '@/lib/auth-client'

const StyledGestureHandlerRootView = withUniwind(GestureHandlerRootView)

export function Main({ children }: PropsWithChildren) {
	return (
		<Providers>
			<StyledGestureHandlerRootView className='flex-1 bg-background'>
				<BottomSheetModalProvider>{children}</BottomSheetModalProvider>
			</StyledGestureHandlerRootView>
		</Providers>
	)
}

function Providers({ children }: PropsWithChildren) {
	const convex_url = process.env.EXPO_PUBLIC_CONVEX_URL
	if (!convex_url) throw new Error('Convex url not provided')
	const client = new ConvexReactClient(convex_url)
	return (
		<ConvexProvider client={client}>
			<ConvexBetterAuthProvider client={client} authClient={authClient}>
				<NotificationContextProvider>{children}</NotificationContextProvider>
			</ConvexBetterAuthProvider>
		</ConvexProvider>
	)
}
