import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'

import '../styles/global.css'

export interface RouterAppContext {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
	component: RootComponent,
	head: () => ({
		meta: [
			{
				title: 'file-drive',
			},
			{
				name: 'description',
				content: 'file-drive is a web application',
			},
		],
		links: [
			{
				rel: 'icon',
				href: '/favicon.ico',
			},
		],
	}),
})

function RootComponent() {
	return (
		<>
			<HeadContent />
			<ThemeProvider
				attribute='class'
				defaultTheme='dark'
				disableTransitionOnChange
				storageKey='vite-ui-theme'
			>
				<div className='grid h-svh grid-rows-[auto_1fr]'>
					<Outlet />
				</div>
				<Toaster richColors />
			</ThemeProvider>
			<TanStackDevtools
				plugins={[
					{
						name: 'TanStack Query',
						render: <ReactQueryDevtools />,
					},
					{
						name: 'TanStack Router',
						render: <TanStackRouterDevtools />,
					},
				]}
			/>
		</>
	)
}
