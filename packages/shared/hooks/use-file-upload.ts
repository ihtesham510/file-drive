import { api } from '@repo/convex'
import axios from 'axios'
import { useAction, useMutation } from 'convex/react'
import { useReducer } from 'react'

type Progress = Map<number, number>

interface State {
	uploading: boolean
	files: File[]
	progress: Progress
}

type Action =
	| {
			type: 'set-files'
			files: File[]
	  }
	| {
			type: 'set-progress'
			progress: [number, number]
	  }
	| {
			type: 'reset-state'
	  }

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case 'set-files':
			return {
				...state,
				files: action.files,
				progress: new Map(action.files.map((_, i) => [i, 0])),
			}
		case 'set-progress': {
			const progress = new Map(state.progress)
			progress.set(action.progress[0], action.progress[1])
			return { ...state, uploading: true, progress }
		}
		case 'reset-state':
			return {
				progress: new Map(),
				uploading: false,
				files: [],
			}
		default:
			return state
	}
}

type QueueElement<T> = { index: number; file: T }

export function useFileUpload(activeOrg?: string, onUpload?: () => void) {
	const getUploadUrl = useAction(api.storage.getUploadUrl)
	const getFileUrl = useAction(api.storage.getFileUrl)
	const createFile = useMutation(api.file.createFile)
	const [state, dispatch] = useReducer(reducer, {
		uploading: false,
		progress: new Map(),
		files: [],
	})

	const queue = state.files.reduce((acc, file, index) => {
		const lastElement = acc.at(-1)
		if (lastElement && lastElement.length < 3) {
			acc.at(-1)?.push({ index, file })
		} else {
			acc.push([{ index, file }])
		}
		return acc
	}, [] as QueueElement<File>[][])

	async function uploadQueue(queue: QueueElement<File>[]) {
		return await Promise.all(
			queue.map(async file => {
				if (file.file) {
					const url = await getUploadUrl()
					const storageId = await uploadFile(file.file, url, progress => {
						dispatch({
							type: 'set-progress',
							progress: [file.index, progress],
						})
					})
					const fileUrl = await getFileUrl({ storageId })
					if (fileUrl) {
						await createFile({
							name: file.file.name,
							org: activeOrg,
							data: {
								storageId,
								type: file.file.type,
								url: fileUrl,
							},
						})
					}
				}
			}),
		)
	}

	async function uploadFiles() {
		for (const list of queue) {
			await uploadQueue(list)
		}
		onUpload?.()
		dispatch({ type: 'reset-state' })
	}

	function setFiles(arg: File[] | ((prev: File[]) => File[])) {
		if (typeof arg === 'function') {
			return dispatch({ type: 'set-files', files: arg(state.files) })
		} else {
			return dispatch({ type: 'set-files', files: arg })
		}
	}
	return { uploadFiles, setFiles, state }
}

async function uploadFile(file: File, url: string, onUploadProgress: (progress: number) => void) {
	const { storageId } = await axios
		.post(url, file, {
			headers: { 'Content-Type': file.type },
			onUploadProgress: ProgressEvent => {
				const { loaded, progress, total } = ProgressEvent
				if (total && progress) {
					const percentage = (loaded * 100) / total
					onUploadProgress(percentage)
				}
			},
		})
		.then(data => data.data)
	return storageId
}
