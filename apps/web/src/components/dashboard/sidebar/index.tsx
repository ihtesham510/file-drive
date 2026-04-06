import { NavMain } from '@/components/dashboard/sidebar/nav-main'
import { Sidebar, SidebarHeader } from '@/components/ui/sidebar'
import { OrgSwitcher } from './nav-switcher'

export function DashboardSideBar() {
	return (
		<Sidebar>
			<SidebarHeader>
				<OrgSwitcher />
			</SidebarHeader>
			<NavMain />
		</Sidebar>
	)
}
