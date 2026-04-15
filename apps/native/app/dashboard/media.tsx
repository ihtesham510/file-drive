import { Image } from 'expo-image'
import { useEffect, useState } from 'react'
import { FlatList, Pressable } from 'react-native'
import { RefreshableContent } from '@/components/common/refreshable-content'
import { ThemedSafeAreaView } from '@/components/common/themed-safe-area-view'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'
import { PermissionNotGranted } from '@/components/dashboard/common/permission-status'
import { useFiles } from '@/hooks/use-files'
import { cn } from '@/utils/tw'

export default function Page() {
	const { files, refresh, requestPermission, permissionStatus, permissionStatusEnum } =
		useFiles()
	const [selecting, setIsSelecting] = useState(false)
	const [selectedFiles, setSelectedFiles] = useState<string[]>([])
	const [dimensions, setDimensions] = useState({
		width: 0,
		height: 0,
	})
	useEffect(() => {
		if (permissionStatus === permissionStatusEnum.UNDETERMINED) {
			requestPermission()
			refresh()
		}
	}, [permissionStatus, permissionStatusEnum.UNDETERMINED, requestPermission, refresh])

	if (permissionStatus === permissionStatusEnum.DENIED) {
		return (
			<ThemedSafeAreaView>
				<PermissionNotGranted />
			</ThemedSafeAreaView>
		)
	}

	return (
		<ThemedSafeAreaView>
			<ThemedView className='relative flex-1 px-2'>
				<ThemedView className='flex-row items-center justify-between'>
					<ThemedText className='my-4 font-bold text-3xl'>Media</ThemedText>
					{selecting && (
						<Pressable className='rounded-xl bg-primary p-2'>
							<ThemedText className='font-bold text-md text-primary-foreground'>
								Upload {selectedFiles.length} files
							</ThemedText>
						</Pressable>
					)}
				</ThemedView>
				<RefreshableContent
					onReload={async () => {
						await refresh()
						setSelectedFiles([])
						setIsSelecting(false)
					}}
				>
					<ThemedView
						className='w-full'
						onLayout={e => {
							setDimensions({
								width: e.nativeEvent.layout.width,
								height: e.nativeEvent.layout.height,
							})
						}}
					>
						<FlatList
							data={files}
							numColumns={3}
							showsVerticalScrollIndicator={false}
							renderItem={({ item }) => {
								return (
									<Pressable
										className='relative flex-1 bg-background'
										onLongPress={() => {
											setIsSelecting(true)
											setSelectedFiles(prev => [...prev, item.uri])
										}}
										onPress={() => {
											if (selectedFiles.includes(item.uri)) {
												setSelectedFiles(prev => prev.filter(uri => uri !== item.uri))
											} else {
												setSelectedFiles(prev => [...prev, item.uri])
											}
										}}
									>
										<Image
											source={{ uri: item.uri }}
											style={{
												width: dimensions.width / 3.1,
												height: dimensions.width / 3.1,
											}}
										/>
										{selecting && (
											<ThemedView
												className={cn(
													'absolute bottom-1 left-1 size-4 rounded-md border border-border bg-secondary',
													selectedFiles?.includes(item.uri) && 'bg-primary',
												)}
											/>
										)}
									</Pressable>
								)
							}}
						/>
					</ThemedView>
				</RefreshableContent>
			</ThemedView>
		</ThemedSafeAreaView>
	)
}
