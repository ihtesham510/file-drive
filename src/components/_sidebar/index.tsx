import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from '@/components/ui/sidebar'
import { NavUser } from '@/components/_sidebar/nav-user'
import { OrganizationSwitcher } from '@/components/_sidebar/organization-swticher'
import { BuildingIcon } from 'lucide-react'

export function AppSideBar() {
	return (
		<Sidebar>
			<SidebarHeader>
				<OrganizationSwitcher
					teams={[{ name: 'ithesham', logo: BuildingIcon, plan: 'free' }]}
				/>
			</SidebarHeader>
			<SidebarContent></SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	)
}
