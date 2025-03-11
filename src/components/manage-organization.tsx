import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { useOrgState } from '@/contexts/org-state'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Image } from 'lucide-react'
import { useRef } from 'react'
import { useMutation } from 'convex/react'
import { useOrg } from '@/hooks/use-org'
import { api } from '@convex/_generated/api'
import axios from 'axios'
import { toast } from 'sonner'

export function ManageOrganizationDialog({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange?: (e: boolean) => void
}) {
	const { currentOrg } = useOrgState()
	const { updateOrg } = useOrg()
	const getUploadUrl = useMutation(api.org.getUploadUrl)
	const getImageUrl = useMutation(api.org.getUrl)
	const ref = useRef<HTMLInputElement | null>(null)
	return (
		<Dialog onOpenChange={e => onOpenChange && onOpenChange(e)} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Manage Organization</DialogTitle>
				</DialogHeader>
				<input
					type='file'
					className='hidden'
					accept='image/*'
					ref={ref}
					onChange={async e => {
						const image = e.target.files?.[0] ?? null
						if (image && currentOrg) {
							let org_image_url = undefined
							const url = await getUploadUrl()
							const { storageId } = await axios
								.post(url, image, {
									headers: { 'Content-Type': image.type },
								})
								.then(data => data.data)
							org_image_url = (await getImageUrl({ storageId })) ?? undefined
							toast.success('Uploaded Image')
							await updateOrg({
								image:
									org_image_url && storageId
										? { url: org_image_url, storageId }
										: undefined,
								id: currentOrg?._id,
							})
						}
					}}
				/>
				<div className='flex items-center gap-4'>
					<Avatar className='size-16'>
						<AvatarImage src={currentOrg?.image?.url} />
						<AvatarFallback>
							<Image />
						</AvatarFallback>
					</Avatar>
					<div className='flex flex-col justify-between'>
						<h1 className='font-bold'>Profile Image</h1>
						<p
							className='text-sm hover:underline cursor-pointer text-secondary-foreground'
							onClick={() => ref.current?.click()}
						>
							Upload Image
						</p>
					</div>
				</div>
				<DialogFooter></DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
