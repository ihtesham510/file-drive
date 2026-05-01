import { Menu02Icon, Notification02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import type { DrawerHeaderProps } from '@react-navigation/drawer'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useResolveClassNames } from 'uniwind'

import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'
import { authClient } from '@/lib/auth-client'

export function DrawerHeader(props: DrawerHeaderProps) {
	const insets = useSafeAreaInsets()
	const { data } = authClient.useSession()
	const imageStyle = useResolveClassNames('size-8 rounded-full absolute')
	return (
		<ThemedView style={{ marginTop: insets.top }}>
			<ThemedView className='h-auto flex-row items-center justify-between p-4'>
				<Pressable onPress={props.navigation.toggleDrawer} className='p-1'>
					<HugeiconsIcon icon={Menu02Icon} size={28} />
				</Pressable>
				<ThemedView className='flex-row items-center gap-4'>
					<Link href='/dashboard/notifications' className='p-1'>
						<HugeiconsIcon icon={Notification02Icon} size={28} />
					</Link>
					<ThemedView className='relative size-12 items-center justify-center rounded-full bg-input/30'>
						<ThemedText className='font-bold text-xl'>{`${data?.user.name[0]}${data?.user.name[1]}`}</ThemedText>
						<Image
							style={imageStyle}
							source={{
								uri: data?.user.image ?? undefined,
							}}
						/>
					</ThemedView>
				</ThemedView>
			</ThemedView>
		</ThemedView>
	)
}
