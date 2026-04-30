import {
	Menu02Icon,
	Notification02Icon,
	Search01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import type { DrawerHeaderProps } from '@react-navigation/drawer'
import { Link, router } from 'expo-router'
import { Pressable, TextInput } from 'react-native'
import {
	SlideInDown,
	SlideInUp,
	SlideOutDown,
	SlideOutUp,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCSSVariable } from 'uniwind'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'

export function DrawerHeader(props: DrawerHeaderProps) {
	const isSearch = props.route.name === 'search'
	const iconColor = useCSSVariable('--color-muted-foreground') as string
	const insets = useSafeAreaInsets()
	return (
		<ThemedView style={{ marginTop: insets.top }}>
			{isSearch ? (
				<ThemedView
					key='search-header'
					animated
					className='h-auto flex-row items-center justify-between bg-transparent p-4'
					entering={SlideInUp}
					exiting={SlideOutUp}
				>
					<ThemedView className='flex-1 flex-row items-center justify-start gap-1 rounded-lg bg-input px-4'>
						<HugeiconsIcon icon={Search01Icon} size={18} color={iconColor} />
						<TextInput placeholder='search folder or files' />
					</ThemedView>
					<Pressable
						className='ml-4 bg-transparent'
						onPress={() => router.push('/dashboard')}
					>
						<ThemedText className='text-bold'>Cancel</ThemedText>
					</Pressable>
				</ThemedView>
			) : (
				<ThemedView
					key='normal-header'
					animated
					className='h-auto flex-row items-center justify-between bg-transparent p-4'
					entering={SlideInDown}
					exiting={SlideOutDown}
				>
					<ThemedView className='flex-row gap-4'>
						<Pressable onPress={props.navigation.toggleDrawer}>
							<HugeiconsIcon icon={Menu02Icon} size={28} />
						</Pressable>
						<ThemedText varient='title'>{props.options.title}</ThemedText>
					</ThemedView>
					<ThemedView className='flex-row gap-4'>
						<Link href='/dashboard/search'>
							<HugeiconsIcon icon={Search01Icon} size={28} />
						</Link>
						<Link href='/dashboard/notifications'>
							<HugeiconsIcon icon={Notification02Icon} size={28} />
						</Link>
					</ThemedView>
				</ThemedView>
			)}
		</ThemedView>
	)
}
