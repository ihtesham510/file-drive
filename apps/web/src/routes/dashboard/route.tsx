import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { DashboardSideBar } from '@/components/dashboard/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

export const Route = createFileRoute('/dashboard')({
	component: RouteComponent,
	async beforeLoad({ context: { session, authClient } }) {
		const orgs = await authClient.organization.list()
		const user = session.data?.user
		if (!user) {
			throw redirect({
				to: '/sign-in',
			})
		}
		return { user, orgs }
	},
})

function RouteComponent() {
	return (
		<SidebarProvider>
			<DashboardSideBar />
			<Outlet />
		</SidebarProvider>
	)
}
