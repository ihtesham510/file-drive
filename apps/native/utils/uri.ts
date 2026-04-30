import { env } from '@file-drive/env/native'
export function getUri(path: string): string {
	return `${env.EXPO_PUBLIC_SERVER_URL}/file-drive/${path}`.trim()
}
