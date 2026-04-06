import { api } from '@repo/convex'
import { useFileUpload } from '@repo/shared'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, usePaginatedQuery } from 'convex/react'
import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute('/dashboard/')({
	component: RouteComponent,
})

function RouteComponent() {
	const { state, setFiles, uploadFiles } = useFileUpload()
	const deleteFiles = useMutation(api.file.deleteFiles)
	const { isLoading, results, status, loadMore } = usePaginatedQuery(
		api.file.getFiles,
		{},
		{
			initialNumItems: 10,
		},
	)

	return (
		<div>
			<div>
				{state.files.map(file => (
					<p key={file.name}>{file.name}</p>
				))}
				{[...state.progress.entries()].map(p => (
					<p key={p[0]}>
						{state.files[p[0]].name} - {p[1]}
					</p>
				))}
				<input
					type='file'
					multiple
					onChange={e => {
						const selectedFiles = e.target.files
						if (selectedFiles) {
							setFiles(Array.from(selectedFiles))
						}
					}}
				/>
				<Button type='button' onClick={async () => await uploadFiles()}>
					Upload
				</Button>
			</div>
			<div className='mt-10'>
				<Button
					onClick={() => {
						const ids = results.map(file => file._id)
						deleteFiles({ file_ids: ids })
					}}
				>
					Delete All
				</Button>
				<div>
					{results.map((file, index) => (
						<div key={index} className='flex justify-between items-center'>
							<h1>{file.name}</h1>
							<div>
								<Button onClick={() => deleteFiles({ file_ids: [file._id] })}>
									<Trash className='size-4' />
								</Button>
							</div>
						</div>
					))}
				</div>
				{isLoading && (
					<div className='w-full items-center justify-center p-10'>
						<Spinner className='size-8' />
					</div>
				)}
				{status === 'CanLoadMore' && <Button onClick={() => loadMore(10)}>Load More</Button>}
			</div>
		</div>
	)
}
