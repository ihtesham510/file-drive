import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { TagsInput } from '@/components/ui/tags-input'
import { useOrg } from '@/hooks/use-org'
import { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Image, LoaderCircle } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import axios from 'axios'
import { Id } from '@convex/_generated/dataModel'

const formSchema = z.object({
	org_name: z.string().min(1).min(2).max(30),
	members_emails: z
		.array(z.string().email())
		.nonempty('Please at least one item'),
})

export function CreateOrganization({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange?: (e: boolean) => void
}) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			members_emails: [],
		},
	})
	const [image, setImage] = useState<File | null>(null)
	const [imageUrl, setImageUrl] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement | null>(null)

	useEffect(() => {
		if (image) {
			const url = URL.createObjectURL(image)
			setImageUrl(url)
		}
	}, [image])

	const { createOrg } = useOrg()
	const getUploadUrl = useMutation(api.org.getUploadUrl)
	const getImageUrl = useMutation(api.org.getUrl)

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			let org_image_url = undefined
			let storage_Id: Id<'_storage'> | undefined
			if (image) {
				const url = await getUploadUrl()
				const { storageId } = await axios
					.post(url, image, {
						headers: { 'Content-Type': image.type },
					})
					.then(data => data.data)
				org_image_url = (await getImageUrl({ storageId })) ?? undefined
				storage_Id = storageId
				toast.success('Uploaded Image')
			}
			await createOrg({
				name: values.org_name,
				emails: values.members_emails,
				image:
					org_image_url && storage_Id
						? {
								url: org_image_url,
								storageId: storage_Id,
							}
						: undefined,
			})

			toast.success('Organization Created')
			reset()
		} catch (error) {
			console.error('Form submission error', error)
			toast.error('Failed to submit the form. Please try again.')
		}
	}
	function reset() {
		setImageUrl(null)
		setImage(null)
		form.reset()
		if (onOpenChange) {
			onOpenChange(false)
		}
	}
	return (
		<Dialog open={open} onOpenChange={e => onOpenChange && onOpenChange(e)}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Organization</DialogTitle>
				</DialogHeader>
				<input
					type='file'
					className='hidden'
					accept='image/*'
					ref={fileInputRef}
					onChange={e => setImage(e.target.files?.[0] ?? null)}
				/>
				<div className='flex items-center gap-4'>
					<Avatar>
						<AvatarImage src={imageUrl ?? undefined} />
						<AvatarFallback>
							<Image />
						</AvatarFallback>
					</Avatar>
					<div className='flex flex-col justify-between'>
						<h1 className='font-bold'>Profile Image</h1>
						<p
							className='text-sm hover:underline cursor-pointer text-secondary-foreground'
							onClick={() =>
								fileInputRef.current && fileInputRef.current.click()
							}
						>
							Upload Image
						</p>
					</div>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
						<FormField
							control={form.control}
							name='org_name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder='Organization Name'
											type='text'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='members_emails'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Add Members</FormLabel>
									<FormControl>
										<TagsInput
											value={field.value}
											onValueChange={field.onChange}
											placeholder='Enter emails of your members'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type='submit' disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? (
									<LoaderCircle className='animate-spin' />
								) : (
									'Submit'
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
