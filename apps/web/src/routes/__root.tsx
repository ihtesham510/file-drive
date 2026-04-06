import { TanStackDevtools } from '@tanstack/react-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import '../styles.css'
import type { ConvexReactClient } from 'convex/react'
import type { authClient } from '@/lib/auth-client'

interface RouterContext {
	authClient: typeof authClient
	convex: ConvexReactClient
	session: ReturnType<typeof authClient.useSession>
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
})

function RootComponent() {
	return (
		<>
			<Outlet />
			<TanStackDevtools
				config={{
					position: 'bottom-right',
				}}
				plugins={[
					{
						name: 'TanStack Router',
						render: <TanStackRouterDevtoolsPanel />,
					},
				]}
			/>
		</>
	)
}
