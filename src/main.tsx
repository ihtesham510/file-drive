import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexReactClient } from 'convex/react'
import { Toaster } from '@/components/ui/sonner'
import './index.css'

// Set up a Router instance
const router = createRouter({
	routeTree,
	defaultPreload: 'intent',
})

// Register things for typesafety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

const rootElement = document.getElementById('app')!

const VITE_CONVEX_URL = import.meta.env.VITE_CONVEX_URL
if (!VITE_CONVEX_URL) {
	throw new Error('VITE_CONVEX_URL is missing in .env.local')
}

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!CLERK_PUBLISHABLE_KEY) {
	throw new Error('CLERK_PUBLISHABLE_KEY is missing in .env.local')
}

const client = new ConvexReactClient(VITE_CONVEX_URL)
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
			<ConvexProviderWithClerk useAuth={useAuth} client={client}>
				<Toaster />
				<RouterProvider router={router} />
			</ConvexProviderWithClerk>
		</ClerkProvider>,
	)
}
