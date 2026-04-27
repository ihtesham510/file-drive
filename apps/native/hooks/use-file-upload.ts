import { env } from '@file-drive/env/native'
import { useMutation } from '@tanstack/react-query'
import { File } from 'expo-file-system'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { trpc } from '@/utils/trpc'
import { uploadFile } from '@/utils/upload'

export function useFileUpload({
	maxUploads = 3,
	onUploadComplete,
}: {
	maxUploads?: number
	onUploadComplete?: (success: string[], failed: string[]) => void
}) {
	const [uris, setUris] = useState<string[]>([])
	const [isUploading, setUploading] = useState(false)
	const [progress, setProgress] = useState<
		{ index: number; progress?: number }[]
	>([])
	const [failedUris, setFailedUris] = useState<string[]>([])
	const [succeededUris, setSucceededUris] = useState<string[]>([])

	const createFile = useMutation({
		...trpc.files.create.mutationOptions(),
		meta: {
			queryKey: trpc.files.list.queryKey(),
		},
	})

	const queue = uris.reduce(
		(acc, uri, index) => {
			const lastItem = acc.at(-1)
			if (!lastItem || lastItem.length === maxUploads) {
				acc.push([{ index, uri }])
			} else {
				lastItem.push({ index, uri })
			}
			return acc
		},
		[] as { index: number; uri: string }[][],
	)

	function reset() {
		setUris([])
		setProgress([])
		setSucceededUris([])
		setFailedUris([])
	}

	async function uploadFiles() {
		const session = await authClient.getSession()
		const token = session.data?.session.token
		if (!token) return
		if (uris.length === 0) return

		setUploading(true)
		setProgress(uris.map((_, index) => ({ index })))

		const localSucceeded: string[] = []
		const localFailed: string[] = []

		for (const batch of queue) {
			await Promise.all(
				batch.map(async ({ index, uri }) => {
					try {
						const uploadUrl = `${env.EXPO_PUBLIC_SERVER_URL}/upload`
						const key = await uploadFile(
							uploadUrl,
							uri,
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
						const file = new File(uri)
						await createFile.mutateAsync({
							key,
							name: file.name,
							type: file.type,
						})
					} catch (err) {
						localFailed.push(uri)
						setFailedUris(prev => [...prev, uri])
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
		{ uris, progress, isUploading, succeededUris, failedUris },
		setUris,
		uploadFiles,
	] as const
}
