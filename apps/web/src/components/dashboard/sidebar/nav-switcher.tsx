import { useRouteContext } from '@tanstack/react-router'
import { ChevronsUpDown, Plus, PlusIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'

export function OrgSwitcher() {
	const { isMobile } = useSidebar()
	const { authClient, orgs } = useRouteContext({
		from: '/dashboard',
	})
	const activeOrg = authClient.useActiveOrganization()

	const handleSelectOrg = async (id: string) => {
		await authClient.organization.setActive({
			organizationId: activeOrg.data?.id === id ? null : id,
		})
		await activeOrg.refetch()
	}
	const activeOrgLoading = activeOrg.isPending || activeOrg.isRefetching
	const noActiveOrg =
		!activeOrgLoading && !activeOrg.data && orgs.data && orgs.data?.length > 0
	const noOrgPresent =
		!activeOrgLoading && !activeOrg.data && orgs.data && orgs.data?.length === 0

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					{!activeOrgLoading && activeOrg.data && (
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size='lg'
								className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
							>
								<Avatar>
									<AvatarImage src={activeOrg.data?.logo ?? undefined} />
									<AvatarFallback>
										{activeOrg.data.name[0]}
										{activeOrg.data.name[1]}
									</AvatarFallback>
								</Avatar>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-medium'>{activeOrg.data.name}</span>
									<span className='truncate text-xs'>{activeOrg.data.slug}</span>
								</div>
								<ChevronsUpDown className='ml-auto' />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
					)}
					{activeOrgLoading && (
						<SidebarMenuButton size='lg'>
							<Skeleton className='h-[300px] w-full rounded-md' />
						</SidebarMenuButton>
					)}
					{noActiveOrg && (
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size='lg'
								className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
							>
								<div className='flex aspect-square size-8 items-center justify-center rounded-lg border-2 border-border border-dotted text-sidebar-primary-foreground'>
									<div className='size-4' />
								</div>
								<span>Select Organization</span>
								<ChevronsUpDown className='ml-auto' />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
					)}
					{noOrgPresent && (
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size='lg'
								className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
							>
								<div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
									<PlusIcon className='size-4' />
								</div>
								<span>Add Organization</span>
							</SidebarMenuButton>
						</DropdownMenuTrigger>
					)}
					<DropdownMenuContent
						className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
						align='start'
						side={isMobile ? 'bottom' : 'right'}
						sideOffset={4}
					>
						<DropdownMenuLabel className='text-muted-foreground text-xs'>
							Organizations
						</DropdownMenuLabel>
						{orgs.data?.map((org, index) => (
							<DropdownMenuItem
								key={org.name}
								onClick={() => handleSelectOrg(org.id)}
								className='gap-2 p-2 aria-selected:bg-background'
							>
								<Avatar>
									<AvatarImage src={org.logo ?? undefined} />
									<AvatarFallback>
										{org.name[0]}
										{org.name[1]}
									</AvatarFallback>
								</Avatar>
								{org.name}
								<DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem className='gap-2 p-2'>
							<div className='flex size-6 items-center justify-center rounded-md border bg-transparent'>
								<Plus className='size-4' />
							</div>
							<div className='font-medium text-muted-foreground'>Add team</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
