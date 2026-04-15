import { Building04Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { Image } from 'expo-image'
import { FlatList, Pressable } from 'react-native'
import { useCSSVariable, useResolveClassNames } from 'uniwind'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'
import { useOrganization } from '@/context/organization-context'
import { cn } from '@/utils/tw'

export function OrganizationList() {
	const { list, setActive, activeOrg } = useOrganization()
	const logoStyles = useResolveClassNames(
		'size-10 rounded-full bg-secondary border-border border',
	)
	const iconColor = useCSSVariable('--color-muted-foreground') as string
	const activeIconColor = useCSSVariable('--color-primary-foreground') as string
	return (
		<FlatList
			data={list}
			keyExtractor={item => item.id}
			showsVerticalScrollIndicator={false}
			contentContainerClassName='pt-2 pb-4'
			renderItem={({ item: organization }) => {
				const isActive = organization.id === activeOrg?.id
				return (
					<Pressable onPress={() => setActive(organization.id)}>
						<ThemedView
							className={cn(
								'mx-4 mb-2 flex-row items-center gap-3 rounded-xl border bg-card p-3',
								isActive ? 'border-primary' : 'border-border',
							)}
						>
							{organization.logo ? (
								<Image
									source={{ uri: organization.logo }}
									contentFit='cover'
									style={logoStyles}
								/>
							) : (
								<ThemedView
									className={cn(
										'size-12 items-center justify-center rounded-xl border border-border',
										isActive ? 'bg-transparent' : 'bg-muted',
									)}
								>
									<HugeiconsIcon
										icon={Building04Icon}
										size={22}
										color={isActive ? activeIconColor : iconColor}
									/>
								</ThemedView>
							)}

							<ThemedView className='flex-1 bg-transparent'>
								<ThemedText
									className={cn(
										'font-medium text-sm',
										isActive ? 'text-primary-foreground' : 'text-foreground',
									)}
								>
									{organization.name}
								</ThemedText>
								<ThemedText
									className={cn(
										'text-xs',
										isActive ? 'text-primary-foreground/60' : 'text-muted-foreground',
									)}
								>
									{organization.slug}
								</ThemedText>
							</ThemedView>

							{isActive && <ThemedView className='h-2 w-2 rounded-full bg-primary' />}
						</ThemedView>
					</Pressable>
				)
			}}
		/>
	)
}
