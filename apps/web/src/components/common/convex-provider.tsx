import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import { ConvexReactClient, ConvexProvider as ConvexReactProvider } from 'convex/react'
import { ConvexQueryCacheProvider } from 'convex-helpers/react/cache'
import type { PropsWithChildren } from 'react'
import { authClient } from '@/lib/auth-client'

const convex_url = import.meta.env.VITE_CONVEX_URL
if (!convex_url) throw new Error('Convex url not found')
const client = new ConvexReactClient(convex_url, {
	expectAuth: true,
})
export function ConvexProvider({ children }: PropsWithChildren) {
	return (
		<ConvexReactProvider client={client}>
			<ConvexQueryCacheProvider>
				<ConvexBetterAuthProvider client={client} authClient={authClient}>
					{children}
				</ConvexBetterAuthProvider>
			</ConvexQueryCacheProvider>
		</ConvexReactProvider>
	)
}
