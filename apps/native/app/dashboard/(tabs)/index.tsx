import { GridViewIcon, LayoutTwoColumnIcon, List, ParagraphBulletsPoint02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { api } from '@repo/convex'
import { usePaginatedQuery } from 'convex/react'
import { Pressable, TextInput } from 'react-native'
import { useCSSVariable } from 'uniwind'
import { BottomSheet, BottomSheetContent, BottomSheetTrigger } from '@/components/common/bottom-sheet'
import { Spinner } from '@/components/common/spinner'
import { ThemedSafeAreaView } from '@/components/common/themed-safe-area-view'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'
import { FileView } from '@/components/dashboard/home/file-viewer'

export default function Page() {
	const iconColor = useCSSVariable('--color-muted-foreground') as string
	const files = usePaginatedQuery(
		api.file.getFiles,
		{
			org: undefined,
		},
		{
			initialNumItems: 10,
		},
	)
	if (files.isLoading) {
		return (
			<ThemedSafeAreaView>
				<ThemedView className='flex-1 items-center justify-center px-4'>
					<Spinner />
				</ThemedView>
			</ThemedSafeAreaView>
		)
	}

	return (
		<ThemedSafeAreaView>
			<BottomSheet>
				<ThemedView className='flex-1 px-2 pt-4'>
					<ThemedText className='mb-2 font-bold text-3xl'>Your Files</ThemedText>
					<ThemedView className='my-4 flex-row items-center justify-between gap-2'>
						<TextInput
							className='flex-1 rounded-xl border border-border bg-input px-2 text-foreground text-sm'
							placeholder='Search Files'
							placeholderTextColor='hsl(var(--muted-foreground))'
							autoCapitalize='none'
							autoCorrect={false}
						/>

						<BottomSheetTrigger>
							<HugeiconsIcon icon={ParagraphBulletsPoint02Icon} size={28} color={iconColor} />
						</BottomSheetTrigger>
						<BottomSheetContent snapPoints={[250]}>
							<ThemedView className='w-full items-center justify-between bg-background p-4'>
								<Pressable className='m-1 w-full flex-1 flex-row items-center justify-center gap-2 rounded-md bg-input p-1'>
									<HugeiconsIcon icon={GridViewIcon} size={28} color={iconColor} />
									<ThemedText>Grid Layout</ThemedText>
								</Pressable>
								<Pressable className='m-1 w-full flex-1 flex-row items-center justify-center gap-2 rounded-md bg-input p-1'>
									<HugeiconsIcon icon={List} size={28} color={iconColor} />
									<ThemedText>List View</ThemedText>
								</Pressable>
								<Pressable className='m-1 w-full flex-1 flex-row items-center justify-center gap-2 rounded-md bg-input p-1'>
									<HugeiconsIcon icon={LayoutTwoColumnIcon} size={28} color={iconColor} />
									<ThemedText>One Column Layout</ThemedText>
								</Pressable>
							</ThemedView>
						</BottomSheetContent>
					</ThemedView>
					<ThemedView>
						<FileView files={files.results} />
					</ThemedView>
				</ThemedView>
			</BottomSheet>
		</ThemedSafeAreaView>
	)
}
