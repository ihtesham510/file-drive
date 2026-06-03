import { env } from '@file-drive/env/native'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { trpc } from '@/utils/trpc'
import { uploadFile } from '@/utils/upload'

export function useFileUpload({
	maxUploads = 3,
	onUploadComplete,
}: {
	maxUploads?: number
	onUploadComplete?: (success: File[], failed: File[]) => void
}) {
	const [files, setFiles] = useState<File[]>([])
	const [isUploading, setUploading] = useState(false)
	const [progress, setProgress] = useState<
		{ index: number; progress?: number }[]
	>([])
	const [FailedFiles, setFailedFiles] = useState<File[]>([])
	const [succeededFiles, setSucceededFiles] = useState<File[]>([])

	const createFile = useMutation(
		trpc.files.create.mutationOptions({
			meta: {
				invalidateQueries: [trpc.files.list.queryKey()],
			},
		}),
	)

	const queue = files.reduce(
		(acc, file, index) => {
			const lastItem = acc.at(-1)
			if (!lastItem || lastItem.length === maxUploads) {
				acc.push([{ index, file }])
			} else {
				lastItem.push({ index, file })
			}
			return acc
		},
		[] as { index: number; file: File }[][],
	)

	function reset() {
		setFiles([])
		setProgress([])
		setSucceededFiles([])
		setFailedFiles([])
	}

	async function uploadFiles() {
		const session = await authClient.getSession()
		const token = session.data?.session.token
		if (!token) return
		if (files.length === 0) return

		setUploading(true)
		setProgress(files.map((_, index) => ({ index })))

		const localSucceeded: File[] = []
		const localFailed: File[] = []

		for (const batch of queue) {
			await Promise.all(
				batch.map(async ({ index, file }) => {
					try {
						const uploadUrl = `${env.EXPO_PUBLIC_SERVER_URL}/upload`
						const key = await uploadFile(
							uploadUrl,
							file,
							pct => {
								setProgress(prev =>
									prev.map(p =>
										p.index === index ? { index, progress: pct } : p,
									),
								)
							},
							token,
						)
						if (!key) return
						await createFile.mutateAsync({
							key,
							name: file.name,
							type: file.type,
						})
					} catch (err) {
						localFailed.push(file)
						setFailedFiles(prev => [...prev, file])
						console.error(err)
					}
				}),
			)
		}

		setUploading(false)
		onUploadComplete?.(localSucceeded, localFailed)
		reset()
	}

	return [
		{
			uris: files,
			progress,
			isUploading,
			succeededUris: succeededFiles,
			failedUris: FailedFiles,
		},
		setFiles,
		uploadFiles,
	] as const
}
