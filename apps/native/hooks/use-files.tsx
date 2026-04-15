import * as MediaLibrary from 'expo-media-library'
import { useCallback, useEffect, useState } from 'react'

export type MediaType = 'image' | 'video' | 'all'

export interface UseFilesOptions {
	mediaType?: MediaType
	pageSize?: number
	albumName?: string
}

function toMediaTypeValue(
	type: MediaType,
): MediaLibrary.MediaTypeValue | MediaLibrary.MediaTypeValue[] {
	if (type === 'image') return MediaLibrary.MediaType.photo
	if (type === 'video') return MediaLibrary.MediaType.video
	return [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video]
}

export function useFiles({
	mediaType = 'all',
	pageSize = 30,
	albumName,
}: UseFilesOptions = {}) {
	const [files, setFiles] = useState<MediaLibrary.Asset[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [endCursor, setEndCursor] = useState<string | undefined>(undefined)
	const [error, setError] = useState<string | null>(null)
	const [permissionStatus, setPermissionStatus] =
		useState<MediaLibrary.PermissionStatus | null>(null)
	const [albumId, setAlbumId] = useState<string | undefined>(undefined)

	const checkPermissions = useCallback(async () => {
		const { status } = await MediaLibrary.getPermissionsAsync()
		setPermissionStatus(status)
		return status === MediaLibrary.PermissionStatus.GRANTED
	}, [])

	const requestPermission = useCallback(async () => {
		try {
			const { status, granted } = await MediaLibrary.requestPermissionsAsync()
			if (granted) {
				console.log('permission granted')
			}
			setPermissionStatus(status)
		} catch (err) {
			console.log('error while requesting permission', err)
		}
	}, [])

	const resolveAlbum = useCallback(async () => {
		if (!albumName) return undefined
		const album = await MediaLibrary.getAlbumAsync(albumName)
		if (!album) {
			setError(`Album "${albumName}" not found.`)
			return undefined
		}
		return album.id
	}, [albumName])

	const load = useCallback(async () => {
		setIsLoading(true)
		setError(null)

		try {
			const granted = await checkPermissions()
			if (!granted) {
				setIsLoading(false)
				return
			}

			const resolvedAlbumId = await resolveAlbum()
			setAlbumId(resolvedAlbumId)

			const {
				assets,
				hasNextPage,
				endCursor: cursor,
			} = await MediaLibrary.getAssetsAsync({
				first: pageSize,
				mediaType: toMediaTypeValue(mediaType),
				sortBy: MediaLibrary.SortBy.creationTime,
				...(resolvedAlbumId ? { album: resolvedAlbumId } : {}),
			})

			setFiles(assets)
			setHasMore(hasNextPage)
			setEndCursor(cursor)
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Failed to load media files.')
			console.log('Failed to load media files.')
		} finally {
			setIsLoading(false)
		}
	}, [checkPermissions, resolveAlbum, mediaType, pageSize])

	const loadMore = useCallback(async () => {
		if (isLoadingMore || !hasMore || !endCursor) return

		setIsLoadingMore(true)
		setError(null)

		try {
			const {
				assets,
				hasNextPage,
				endCursor: cursor,
			} = await MediaLibrary.getAssetsAsync({
				first: pageSize,
				after: endCursor,
				mediaType: toMediaTypeValue(mediaType),
				sortBy: MediaLibrary.SortBy.creationTime,
				...(albumId ? { album: albumId } : {}),
			})

			setFiles(prev => [...prev, ...assets])
			setHasMore(hasNextPage)
			setEndCursor(cursor)
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Failed to load more files.')
			console.log('Failed to load more files')
		} finally {
			setIsLoadingMore(false)
		}
	}, [isLoadingMore, hasMore, endCursor, pageSize, mediaType, albumId])

	const refresh = useCallback(async () => {
		setFiles([])
		setEndCursor(undefined)
		setHasMore(true)
		await load()
	}, [load])

	useEffect(() => {
		load()
	}, [load])

	useEffect(() => {
		if (permissionStatus !== MediaLibrary.PermissionStatus.GRANTED) return

		const subscription = MediaLibrary.addListener(() => {
			// Silently refresh when the camera roll changes (new photo taken, etc.)
			refresh()
		})

		return () => subscription.remove()
	}, [permissionStatus, refresh])

	return {
		files,
		isLoading,
		isLoadingMore,
		hasMore,
		permissionStatus,
		error,
		requestPermission,
		loadMore,
		refresh,
		permissionStatusEnum: MediaLibrary.PermissionStatus,
	}
}
