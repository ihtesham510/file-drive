import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
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
import { SignOutButton, useClerk, useUser } from '@clerk/clerk-react'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Badge } from '../ui/badge'
import { NotificationDialogContent } from '../notifications-dialog'
import { useOrg } from '@/hooks/use-org'

export function NavUser() {
	const { isMobile } = useSidebar()
	const { user } = useUser()
	const { invitations } = useOrg()
	const { redirectToUserProfile } = useClerk()

	return (
		<>
			<Dialog>
				<NotificationDialogContent />
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size='lg'
									className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
								>
									<Avatar className='h-8 w-8 rounded-lg'>
										<AvatarImage
											src={user?.imageUrl}
											alt={user?.fullName ?? user?.firstName ?? ''}
										/>
										<AvatarFallback className='rounded-lg'>CN</AvatarFallback>
									</Avatar>
									<div className='grid flex-1 text-left text-sm leading-tight'>
										<span className='truncate font-semibold'>
											{user?.fullName ?? user?.firstName}
										</span>
										<span className='truncate text-xs'>
											{user?.emailAddresses[0].emailAddress}
										</span>
									</div>
									<ChevronsUpDown className='ml-auto size-4' />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
								side={isMobile ? 'bottom' : 'right'}
								align='end'
								sideOffset={4}
							>
								<DropdownMenuLabel className='p-0 font-normal'>
									<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
										<Avatar className='h-8 w-8 rounded-lg'>
											<AvatarImage
												src={user?.imageUrl}
												alt={user?.fullName ?? user?.firstName ?? ''}
											/>
											<AvatarFallback className='rounded-lg'>CN</AvatarFallback>
										</Avatar>
										<div className='grid flex-1 text-left text-sm leading-tight'>
											<span className='truncate font-semibold'>
												{user?.fullName ?? user?.firstName}
											</span>
											<span className='truncate text-xs'>
												{user?.emailAddresses[0].emailAddress}
											</span>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem
										onClick={async () => {
											await redirectToUserProfile()
										}}
									>
										<BadgeCheck />
										Account
									</DropdownMenuItem>
									<DialogTrigger asChild>
										<DropdownMenuItem>
											<Bell />
											Notifications
											<DropdownMenuShortcut>
												{invitations && invitations?.length > 0 && (
													<Badge className='text-[10px]'>
														{invitations?.length}
													</Badge>
												)}
											</DropdownMenuShortcut>
										</DropdownMenuItem>
									</DialogTrigger>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<SignOutButton>
									<DropdownMenuItem>
										<LogOut />
										Log out
									</DropdownMenuItem>
								</SignOutButton>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</Dialog>
		</>
	)
}
