import { api } from '@repo/convex'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { DashboardSideBar } from '@/components/dashboard/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

export const Route = createFileRoute('/dashboard')({
	component: RouteComponent,
	async beforeLoad({ context: { isAuthenticated, authClient, convex } }) {
		const orgs = await authClient.organization.list()
		const user = await convex.query(api.user.getAuthUser)
		if (!isAuthenticated || !user) {
			throw redirect({
				to: '/sign-in',
			})
		}
		return { orgs, user }
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
