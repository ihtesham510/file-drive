import { ArrowDown01Icon, Building04Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { Image } from 'expo-image'
import { useCSSVariable, useResolveClassNames } from 'uniwind'
import {
	BottomSheet,
	BottomSheetContent,
	BottomSheetTrigger,
} from '@/components/common/bottom-sheet'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'
import { useOrganization } from '@/context/organization-context'
import { OrganizationList } from './organization-list'

export function OrganizationHeader() {
	const logoStyles = useResolveClassNames('size-10 rounded-full bg-secondary')
	const iconColor = useCSSVariable('--color-foreground') as string
	const { activeOrg } = useOrganization()
	if (!activeOrg) return null
	return (
		<BottomSheet>
			<ThemedView className='flex-row items-center justify-between'>
				<BottomSheetTrigger className='w-[85%]'>
					<ThemedView className='mx-4 mt-3 mb-2 flex-row items-center justify-between rounded-2xl border border-border p-3'>
						<ThemedView className='flex-row items-center gap-3 bg-transparent'>
							{activeOrg?.logo ? (
								<Image
									source={{ uri: activeOrg.logo }}
									contentFit='cover'
									style={logoStyles}
								/>
							) : (
								<ThemedView className='size-10 items-center justify-center rounded-full border border-border bg-muted'>
									<HugeiconsIcon icon={Building04Icon} size={18} color={iconColor} />
								</ThemedView>
							)}

							<ThemedView className='bg-transparent'>
								<ThemedText className='text-muted-foreground text-xs'>
									Organization
								</ThemedText>
								<ThemedText className='font-medium text-foreground text-sm'>
									{activeOrg?.name ?? 'Select organization'}
								</ThemedText>
							</ThemedView>
						</ThemedView>
						<HugeiconsIcon icon={ArrowDown01Icon} size={18} color={iconColor} />
					</ThemedView>
				</BottomSheetTrigger>
				<ThemedView className='w-[15%] rounded-full p-2'>
					<HugeiconsIcon icon={PlusSignIcon} size={28} color={iconColor} />
				</ThemedView>
			</ThemedView>
			<BottomSheetContent snapPoints={[700]} view={{ alignItems: 'stretch' }}>
				<ThemedView className='flex-1 bg-transparent'>
					<ThemedText className='px-5 pt-1 pb-3 font-medium text-muted-foreground text-xs uppercase tracking-widest'>
						Switch organization
					</ThemedText>
					<OrganizationList />
				</ThemedView>
			</BottomSheetContent>
		</BottomSheet>
	)
}
