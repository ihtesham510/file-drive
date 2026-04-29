import { Logout02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import {
	type DrawerContentComponentProps,
	DrawerContentScrollView,
} from '@react-navigation/drawer'
import { Image } from 'expo-image'
import { Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCSSVariable, useResolveClassNames, withUniwind } from 'uniwind'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

const StyledSafeAreaView = withUniwind(SafeAreaView)
const StyledPressable = withUniwind(Pressable)

export function CustomDrawer(props: DrawerContentComponentProps) {
	const { data } = authClient.useSession()
	const imageStyle = useResolveClassNames('size-14 absolute rounded-full')
	const [iconInActiveColor, iconActiveColor, destructiveColor] = useCSSVariable(
		['--color-muted-foreground', '--color-primary', '--color-destructive'],
	) as string[]

	return (
		<StyledSafeAreaView className='flex-1 bg-background'>
			<ThemedView className='border-border border-b px-5 pt-5 pb-5'>
				<ThemedView className='relative mb-3 self-start'>
					<ThemedView className='h-14 w-14 items-center justify-center rounded-full bg-primary'>
						<ThemedText className='font-bold text-lg text-primary-foreground leading-tight'>
							{`${data?.user.name[0]}${data?.user.name[1]}`.trim()}
						</ThemedText>
					</ThemedView>
					<Image
						source={{
							uri: data?.user.image ?? undefined,
						}}
						style={imageStyle}
					/>
					<ThemedView className='absolute right-0.5 bottom-0.5 h-3 w-3 rounded-full border-2 border-background bg-green-400' />
				</ThemedView>

				<ThemedText className='mb-0.5 font-semibold text-[17px] text-foreground'>
					{data?.user.name}
				</ThemedText>
				<ThemedText className='mb-3.5 text-[13px] text-muted-foreground'>
					{data?.user.email}
				</ThemedText>

				<ThemedView className='gap-1.5'>
					<ThemedView className='h-1 overflow-hidden rounded-sm bg-border'>
						<ThemedView className='h-full w-[62%] rounded-sm bg-primary' />
					</ThemedView>
					<ThemedText className='text-[11px] text-muted-foreground'>
						6.2 GB of 10 GB used
					</ThemedText>
				</ThemedView>
			</ThemedView>

			<DrawerContentScrollView
				{...props}
				scrollEnabled={false}
				contentContainerStyle={{ paddingTop: 16, paddingHorizontal: 12 }}
			>
				{props.state.routes.map((item, index) => {
					const isFocused = props.state.index === index
					const { options } = props.descriptors[item.key]

					return (
						<StyledPressable
							key={item.key}
							className={cn(
								'relative mb-0.5 flex-row items-center gap-3 rounded-xl px-3 py-2.75 active:opacity-70',
								isFocused && 'bg-primary/10',
							)}
							onPress={() => {
								const event = props.navigation.emit({
									type: 'drawerItemPress',
									target: item.key,
									canPreventDefault: true,
								})

								if (!isFocused && !event.defaultPrevented) {
									props.navigation.navigate(item.name, item.params)
								}
							}}
						>
							{options.drawerIcon?.({
								color: isFocused ? iconActiveColor : iconInActiveColor,
								focused: isFocused,
								size: 22,
							})}
							<ThemedText
								className={cn(
									'font-medium text-[15px] text-muted-foreground',
									isFocused && 'font-semibold text-primary',
								)}
							>
								{options.title}
							</ThemedText>
							{isFocused && (
								<ThemedView className='absolute right-3 h-1.5 w-1.5 rounded-full bg-primary' />
							)}
						</StyledPressable>
					)
				})}
			</DrawerContentScrollView>

			<StyledPressable
				className='mx-4 mb-6 flex-row items-center gap-2.5 rounded-xl border border-destructive/25 bg-input/20 px-4 py-3 active:opacity-70'
				onPress={async () => await authClient.signOut()}
			>
				<HugeiconsIcon size={20} color={destructiveColor} icon={Logout02Icon} />
				<ThemedText className='font-semibold text-[15px] text-destructive'>
					Sign Out
				</ThemedText>
			</StyledPressable>
		</StyledSafeAreaView>
	)
}
