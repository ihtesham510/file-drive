import axios from 'axios'

export async function uploadFile(
	postUrl: string,
	file: File,
	onProgress: (percent: number) => void,
	token: string,
): Promise<string | null> {
	const bytes = await file.bytes()

	try {
		const res = await axios.post<{ key: string }>(postUrl, bytes, {
			headers: {
				contentType: file.type,
				fileName: file.name,
				Authorization: token,
			},
			onUploadProgress: ({ loaded, total }) => {
				if (total) {
					const percentage = Math.min(Math.floor((loaded / total) * 100), 100)
					onProgress(percentage)
				}
			},
		})

		return res.data.key
	} catch (err) {
		if (err) console.error(err)
		return null
	}
}
