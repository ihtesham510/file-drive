import { env } from '@file-drive/env/web'
export function getUri(path: string): string {
	return `${env.VITE_SERVER_URL}/file-drive/${path}`.trim()
}
