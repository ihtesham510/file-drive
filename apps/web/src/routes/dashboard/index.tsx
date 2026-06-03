/** biome-ignore-all lint/suspicious/noArrayIndexKey: <can use index as key> */

import { createFileRoute } from '@tanstack/react-router'
import {
	Download,
	FileImage,
	LayoutGrid,
	List,
	MoreVertical,
	Search,
	Share2,
	Trash2,
	Upload,
} from 'lucide-react'
import { Suspense, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useFiles } from '@/hooks/use-files'
import { useTrash } from '@/hooks/use-trash'
import { trpc } from '@/utils/trpc'
import { getUri } from '@/utils/uri'

export const Route = createFileRoute('/dashboard/')({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) => {
		await queryClient.prefetchQuery(trpc.files.list.queryOptions())
	},
})

function FileSkeleton({ view }: { view: 'grid' | 'list' }) {
	if (view === 'grid') {
		return (
			<div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
				{Array.from({ length: 10 }).map((_, i) => (
					<Card key={i} className='overflow-hidden'>
						<Skeleton className='aspect-square w-full' />
						<CardContent className='p-3'>
							<Skeleton className='h-4 w-3/4' />
							<Skeleton className='mt-1.5 h-3 w-1/2' />
						</CardContent>
					</Card>
				))}
			</div>
		)
	}
	return (
		<div className='space-y-1'>
			{Array.from({ length: 8 }).map((_, i) => (
				<div key={i} className='flex items-center gap-3 rounded-lg px-3 py-2.5'>
					<Skeleton className='size-10 rounded-md' />
					<div className='flex-1 space-y-1.5'>
						<Skeleton className='h-4 w-48' />
						<Skeleton className='h-3 w-24' />
					</div>
					<Skeleton className='h-4 w-16' />
				</div>
			))}
		</div>
	)
}

function FileActions({
	fileId,
	onDelete,
	key,
}: {
	fileId: string
	key: string
	onDelete: (key: string) => void
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Button
					variant='ghost'
					size='icon'
					className='size-7 opacity-0 transition-opacity group-hover:opacity-100'
				>
					<MoreVertical className='size-4' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-44'>
				<DropdownMenuItem>
					<Download className='mr-2 size-4' />
					Download
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => navigator.clipboard.writeText(getUri(key))}
				>
					<Share2 className='mr-2 size-4' />
					Share
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className='text-destructive focus:text-destructive'
					onSelect={() => onDelete(fileId)}
				>
					<Trash2 className='mr-2 size-4' />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

function FileGrid({
	files,
	onDelete,
}: {
	files: { id: string; key: string; name: string }[]
	onDelete: (key: string) => void
}) {
	return (
		<div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
			{files.map(file => (
				<Card
					key={file.key}
					className='group overflow-hidden transition-shadow hover:shadow-md'
				>
					<div className='relative aspect-square overflow-hidden bg-muted'>
						<Avatar className='size-full rounded-none'>
							<AvatarImage
								alt={file.name}
								src={getUri(file.key)}
								className='size-full rounded-none object-cover'
							/>
							<AvatarFallback className='size-full rounded-none bg-muted'>
								<FileImage className='size-10 text-muted-foreground/40' />
							</AvatarFallback>
						</Avatar>
						<div className='absolute top-1.5 right-1.5'>
							<FileActions
								fileId={file.id}
								key={file.key}
								onDelete={onDelete}
							/>
						</div>
					</div>
					<CardContent className='p-3'>
						<p
							className='truncate font-medium text-sm leading-tight'
							title={file.name}
						>
							{file.name}
						</p>
						<Badge variant='secondary' className='mt-1.5 text-[10px]'>
							Image
						</Badge>
					</CardContent>
				</Card>
			))}
		</div>
	)
}

function FileList({
	files,
	onDelete,
}: {
	files: { key: string; name: string; id: string }[]
	onDelete: (key: string) => void
}) {
	return (
		<div className='space-y-0.5'>
			{files.map(file => (
				<div
					key={file.key}
					className='group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent'
				>
					<Avatar className='size-10 rounded-md'>
						<AvatarImage
							alt={file.name}
							src={getUri(file.key)}
							className='size-10 rounded-md object-cover'
						/>
						<AvatarFallback className='size-10 rounded-md bg-muted'>
							<FileImage className='size-4 text-muted-foreground/50' />
						</AvatarFallback>
					</Avatar>
					<div className='min-w-0 flex-1'>
						<p className='truncate font-medium text-sm'>{file.name}</p>
						<p className='text-muted-foreground text-xs'>Image</p>
					</div>
					<Badge variant='outline' className='shrink-0 text-[10px]'>
						PNG
					</Badge>
					<FileActions fileId={file.id} key={file.key} onDelete={onDelete} />
				</div>
			))}
		</div>
	)
}

function FilesContent() {
	const { files } = useFiles()
	const { addToTrash } = useTrash()
	const [view, setView] = useState<'grid' | 'list'>('grid')
	const [search, setSearch] = useState('')

	const filtered = files.data?.filter(f =>
		f.name.toLowerCase().includes(search.toLowerCase()),
	)

	const handleDelete = async (id: string) => {
		await addToTrash.mutateAsync({ ids: [id] })
	}

	return (
		<>
			{/* Toolbar */}
			<div className='flex items-center gap-2'>
				<div className='relative flex-1'>
					<Search className='absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder='Search files…'
						value={search}
						onChange={e => setSearch(e.target.value)}
						className='pl-8'
					/>
				</div>
				<div className='flex items-center rounded-md border bg-background p-0.5'>
					<Button
						variant={view === 'grid' ? 'secondary' : 'ghost'}
						size='icon'
						className='size-8'
						onClick={() => setView('grid')}
					>
						<LayoutGrid className='size-4' />
					</Button>
					<Button
						variant={view === 'list' ? 'secondary' : 'ghost'}
						size='icon'
						className='size-8'
						onClick={() => setView('list')}
					>
						<List className='size-4' />
					</Button>
				</div>
				<Button size='sm' className='gap-1.5'>
					<Upload className='size-4' />
					Upload
				</Button>
			</div>

			{/* Count */}
			{filtered && (
				<p className='text-muted-foreground text-sm'>
					{filtered.length} {filtered.length === 1 ? 'file' : 'files'}
				</p>
			)}

			{/* Files */}
			{filtered?.length === 0 ? (
				<div className='flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground'>
					<FileImage className='size-10 opacity-30' />
					<p className='text-sm'>No files found</p>
				</div>
			) : view === 'grid' ? (
				<FileGrid files={filtered ?? []} onDelete={handleDelete} />
			) : (
				<FileList files={filtered ?? []} onDelete={handleDelete} />
			)}
		</>
	)
}

function RouteComponent() {
	return (
		<div className='mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 md:p-6'>
			{/* Header */}
			<div>
				<h1 className='font-semibold text-2xl tracking-tight'>Files</h1>
				<p className='text-muted-foreground text-sm'>
					Manage and browse your uploaded files
				</p>
			</div>
			<Separator />

			<Suspense fallback={<FileSkeleton view='grid' />}>
				<FilesContent />
			</Suspense>
		</div>
	)
}
