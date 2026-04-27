import { File } from 'expo-file-system'
import { Image } from 'expo-image'
import { useEffect } from 'react'
import { Button, FlatList, Pressable } from 'react-native'
import { useResolveClassNames } from 'uniwind'
import { Container } from '@/components/common/container'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'
import { useFileUpload } from '@/hooks/use-file-upload'
import { useFiles } from '@/hooks/use-files'

export default function Page() {
	const { files, permissionStatus, requestPermission, permissionStatusEnum } =
		useFiles()
	const imageStyles = useResolveClassNames('h-125 w-[90%] rounded-lg')
	const [uploadState, setSelectedFiles, handleUpload] = useFileUpload({})
	const selectedFiles = uploadState.uris

	useEffect(() => {
		if (permissionStatus === permissionStatusEnum.UNDETERMINED) {
			requestPermission()
		}
	}, [permissionStatus, permissionStatusEnum.UNDETERMINED, requestPermission])

	const isDenied = permissionStatus === permissionStatusEnum.DENIED

	if (uploadState.isUploading) {
		return (
			<Container className='flex-1 items-center justify-center'>
				<FlatList
					data={uploadState.progress}
					renderItem={({ item }) => {
						const file = new File(selectedFiles[item.index])
						return (
							<ThemedView>
								<ThemedText>
									{file.name} - {item.progress ?? 0}
								</ThemedText>
							</ThemedView>
						)
					}}
				/>
			</Container>
		)
	}

	if (isDenied) {
		return (
			<Container className='flex items-center justify-center gap-4'>
				<ThemedText varient='title'>Permission Denied</ThemedText>
				<Button title='Request Permission' onPress={requestPermission} />
			</Container>
		)
	}

	return (
		<Container bottom={false} className='relative'>
			<FlatList
				data={files}
				className='gap-4'
				showsVerticalScrollIndicator={false}
				renderItem={({ item }) => {
					const isSelected = selectedFiles.includes(item.uri)
					return (
						<Pressable
							onPress={() =>
								setSelectedFiles(prev =>
									isSelected
										? prev.filter(uri => uri !== item.uri)
										: [...prev, item.uri],
								)
							}
							className='relative my-4 w-full items-center justify-center'
						>
							<Image
								style={imageStyles}
								source={{
									uri: item.uri,
								}}
							/>
							{isSelected && (
								<ThemedView className='absolute bottom-6 left-12 size-6 rounded-md bg-primary' />
							)}
						</Pressable>
					)
				}}
			/>
			{selectedFiles.length > 0 && (
				<ThemedView className='absolute bottom-4 w-full items-center justify-center bg-transparent'>
					<Pressable
						className='rounded-full bg-primary p-4 px-8'
						onPress={handleUpload}
					>
						<ThemedText varient='title'>Upload</ThemedText>
					</Pressable>
				</ThemedView>
			)}
		</Container>
	)
}
