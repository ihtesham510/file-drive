import {
	ArrowRightLeft,
	BuildingIcon,
	ChevronsUpDown,
	Plus,
	Settings,
	User2Icon,
} from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CreateOrganization } from '@/components/create-organization'
import { useOrg } from '@/hooks/use-org'
import { useUser } from '@clerk/clerk-react'
import { useState } from 'react'
import { useOrgState } from '@/contexts/org-state'
import { ManageOrganizationDialog } from '../manage-organization'

export function OrganizationSwitcher() {
	const { isMobile } = useSidebar()
	const { orgs } = useOrg()
	const { user } = useUser()
	const { currentOrg, setCurrentOrg } = useOrgState()
	const [openCreateOrganization, setOpenCreateOrganization] = useState(false)
	const [openManageOrganization, setOpenManageOrganization] = useState(false)
	return (
		<>
			<CreateOrganization
				open={openCreateOrganization}
				onOpenChange={e => setOpenCreateOrganization(e)}
			/>
			<ManageOrganizationDialog
				open={openManageOrganization}
				onOpenChange={e => setOpenManageOrganization(e)}
			/>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size='lg'
								className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
							>
								<div className='flex aspect-square size-8 items-center justify-center rounded-lg border border-border'>
									<Avatar>
										<AvatarImage
											src={currentOrg ? currentOrg.image_url : user?.imageUrl}
										/>
										<AvatarFallback>
											{currentOrg ? <BuildingIcon /> : <User2Icon />}
										</AvatarFallback>
									</Avatar>
								</div>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-semibold'>
										{currentOrg ? currentOrg.name : 'Personal Account'}
									</span>
								</div>
								<ChevronsUpDown className='ml-auto' />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
							align='start'
							side={isMobile ? 'bottom' : 'right'}
							sideOffset={4}
						>
							{currentOrg && (
								<>
									<DropdownMenuLabel className='text-xs text-muted-foreground'>
										Current Organization
									</DropdownMenuLabel>
									<DropdownMenuItem
										className='gap-2 p-2'
										onClick={() => setOpenManageOrganization(true)}
									>
										<div className='flex size-6 items-center justify-center rounded-md border bg-background'>
											<Settings className='size-4' />
										</div>
										<div className='font-medium text-muted-foreground'>
											Manage Organization
										</div>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
								</>
							)}
							<DropdownMenuLabel className='text-xs text-muted-foreground'>
								Organizations
							</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => setCurrentOrg(null)}
								className='gap-4 p-2'
							>
								<div className='flex size-6 items-center justify-center rounded-sm border'>
									<Avatar>
										<AvatarImage src={user?.imageUrl} />
										<AvatarFallback>
											<User2Icon />
										</AvatarFallback>
									</Avatar>
								</div>
								Personal Account
								<DropdownMenuShortcut>
									<ArrowRightLeft />
								</DropdownMenuShortcut>
							</DropdownMenuItem>
							{orgs?.map((org, index) => (
								<DropdownMenuItem
									key={index}
									onClick={() => setCurrentOrg(org._id)}
									className='gap-4 p-2'
								>
									<div className='flex size-6 items-center justify-center rounded-sm border'>
										<Avatar>
											<AvatarImage src={org.image_url} />
											<AvatarFallback>
												<BuildingIcon />
											</AvatarFallback>
										</Avatar>
									</div>
									{org.name}
									<DropdownMenuShortcut>
										<ArrowRightLeft />
									</DropdownMenuShortcut>
								</DropdownMenuItem>
							))}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className='gap-2 p-2'
								onClick={() => setOpenCreateOrganization(true)}
							>
								<div className='flex size-6 items-center justify-center rounded-md border bg-background'>
									<Plus className='size-4' />
								</div>
								<div className='font-medium text-muted-foreground'>
									Create Organization
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		</>
	)
}
