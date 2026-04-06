import { api } from '@repo/convex'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { useConvex, useQuery } from 'convex/react'
import ReactDOM from 'react-dom/client'
import { ConvexProvider } from '@/components/common/convex-provider'
import { Spinner } from '@/components/ui/spinner'
import { authClient } from '@/lib/auth-client'
import { routeTree } from '@/routeTree.gen'

const router = createRouter({
	routeTree,
	context: undefined!,
	defaultPreload: 'intent',
	scrollRestoration: true,
})

document.documentElement.classList.add('dark')

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<ConvexProvider>
			<App />
		</ConvexProvider>,
	)
}

function App() {
	const convex = useConvex()
	const session = authClient.useSession()
	if (session.isPending)
		return (
			<div className='flex bg-background justify-center items-center h-screen w-full'>
				<Spinner className='size-8' />
			</div>
		)
	return <RouterProvider router={router} context={{ convex, session, authClient }} />
}
