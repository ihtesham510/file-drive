import { File } from 'expo-file-system'
import type * as MediaLibrary from 'expo-media-library'

export function mediaAssetToFile(asset: MediaLibrary.Asset): File {
	return new File(asset.uri)
}
