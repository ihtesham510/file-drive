import {
	Menu02Icon,
	Notification02Icon,
	Search01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import type { DrawerHeaderProps } from '@react-navigation/drawer'
import { Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'

export function DrawerHeader(props: DrawerHeaderProps) {
	const insets = useSafeAreaInsets()
	return (
		<ThemedView
			className='h-auto flex-row items-center justify-between p-4'
			style={{ marginTop: insets.top }}
		>
			<ThemedView className='flex-row gap-4'>
				<Pressable onPress={props.navigation.toggleDrawer}>
					<HugeiconsIcon icon={Menu02Icon} size={28} />
				</Pressable>
				<ThemedText varient='title'>{props.options.title}</ThemedText>
			</ThemedView>
			<ThemedView className='flex-row gap-4'>
				<Pressable>
					<HugeiconsIcon icon={Search01Icon} size={28} />
				</Pressable>
				<Pressable>
					<HugeiconsIcon icon={Notification02Icon} size={28} />
				</Pressable>
			</ThemedView>
		</ThemedView>
	)
}
