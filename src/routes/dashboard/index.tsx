import { AppSideBar } from '@/components/_sidebar'
import {
	SidebarProvider,
	SidebarInset,
	SidebarTrigger,
} from '@/components/ui/sidebar'
import { OrgContextProvider } from '@/contexts/org-state'
import { RedirectToSignIn, useAuth } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
	component: () => {
		const { isLoaded, isSignedIn } = useAuth()
		const isAuthenticated = isLoaded && isSignedIn
		if (!isAuthenticated) {
			return <RedirectToSignIn />
		}
		return <RouteComponent />
	},
})

function RouteComponent() {
	return (
		<OrgContextProvider>
			<SidebarProvider>
				<AppSideBar />
				<SidebarInset>
					<SidebarTrigger />
				</SidebarInset>
			</SidebarProvider>
		</OrgContextProvider>
	)
}
