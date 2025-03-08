import {
	DialogHeader,
	DialogContent,
	DialogTitle,
} from '@/components/ui/dialog'
import { useOrg } from '@/hooks/use-org'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { BuildingIcon, CheckIcon, Trash2 } from 'lucide-react'
import { Button } from './ui/button'

export function NotificationDialogContent() {
	const { invitations, acceptInvitation, rejectInvitation } = useOrg()
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Notifications</DialogTitle>
			</DialogHeader>

			{invitations && invitations.length === 0 && (
				<div className='mx-auto m-20'>
					<h1 className='text-sm text-primary/50'>No Current Notifications</h1>
				</div>
			)}

			{invitations && invitations.length !== 0 && (
				<div>
					<h1 className='text-sm font-bold'>Invitations</h1>
					{invitations?.map(invitation => (
						<div className='flex justify-between my-2' key={invitation._id}>
							<div className='flex gap-4 justify-center items-center'>
								<Avatar>
									<AvatarImage src={invitation.org.image_url} />
									<AvatarFallback>
										<BuildingIcon />
									</AvatarFallback>
								</Avatar>
								<h1>{invitation.org.name}</h1>
							</div>
							<div className='flex gap-2  justify-center items-center'>
								<Button
									size='icon'
									variant='outline'
									onClick={() =>
										acceptInvitation({ invitationId: invitation._id })
									}
								>
									<CheckIcon />
								</Button>
								<Button
									size='icon'
									onClick={() =>
										rejectInvitation({ invitationId: invitation._id })
									}
								>
									<Trash2 />
								</Button>
							</div>
						</div>
					))}
				</div>
			)}
		</DialogContent>
	)
}
