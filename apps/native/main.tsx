import type { PropsWithChildren } from 'react'
import { View } from 'react-native'
import './global.css'
import { NotificationContextProvider } from '@/context/notification-context'

import 'react-native-reanimated'

import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { authClient } from '@/lib/auth-client'

export function Main({ children }: PropsWithChildren) {
	return (
		<Providers>
			<View className='flex-1 bg-background'>{children}</View>
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
