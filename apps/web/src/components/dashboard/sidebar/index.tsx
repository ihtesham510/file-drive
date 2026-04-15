import { NavMain } from '@/components/dashboard/sidebar/nav-main'
import { Sidebar, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import { OrgSwitcher } from './nav-switcher'
import { NavUser } from './nav-user'

export function DashboardSideBar() {
	return (
		<Sidebar>
			<SidebarHeader>
				<OrgSwitcher />
			</SidebarHeader>
			<NavMain />
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	)
}
