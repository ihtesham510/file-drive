import { useBottomSheetModal } from '@gorhom/bottom-sheet'
import { Album02Icon, Folder02Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import type { NavigationRoute, ParamListBase } from '@react-navigation/native'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { Dimensions, Pressable } from 'react-native'
import { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCSSVariable } from 'uniwind'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'
import { BottomSheet, BottomSheetContent, BottomSheetTrigger } from './bottom-sheet'

interface TabBarProps extends BottomTabBarProps {}

export function TabBar(props: TabBarProps) {
	const insets = useSafeAreaInsets()
	function renderTabButton(index: number) {
		return <TabButton {...props} route={props.state.routes[index]} index={index} />
	}

	return (
		<ThemedView className='w-full items-center justify-center'>
			<ThemedView
				style={{
					width: Dimensions.get('window').width / 1.05,
					marginBottom: insets.bottom / 1.8,
				}}
				className='absolute bottom-6 flex-row items-center justify-around rounded-full bg-card p-1'
			>
				{renderTabButton(0)}
				{renderTabButton(1)}
				<PlusButton />
				{renderTabButton(2)}
				{renderTabButton(3)}
			</ThemedView>
		</ThemedView>
	)
}

interface TabButtonProps extends TabBarProps {
	route: NavigationRoute<ParamListBase, string>
	index: number
}

function TabButton({ route, index, ...props }: TabButtonProps) {
	const isFocused = props.state.index === index
	const { options } = props.descriptors[route.key]
	const color = useCSSVariable('--color-foreground') as string
	const icon = options.tabBarIcon?.({
		focused: isFocused,
		color,
		size: 28,
	})
	const title = options.title ?? route.name

	const onPress = () => {
		const event = props.navigation.emit({
			type: 'tabPress',
			target: route.key,
			canPreventDefault: true,
		})

		if (!isFocused && !event.defaultPrevented) {
			props.navigation.navigate(route.name, route.params)
		}
	}
	const animatedValue = useSharedValue(0)

	// biome-ignore lint/correctness/useExhaustiveDependencies: <cannot pass shared value as dependency>
	useEffect(() => {
		animatedValue.value = withSpring(Number(isFocused), {
			duration: 280,
		})
	}, [isFocused])

	const animatedScale = useAnimatedStyle(() => {
		return {
			transform: [
				{
					scale: interpolate(animatedValue.value, [0, 1], [1, 1.2]),
				},
			],
			top: interpolate(animatedValue.value, [0, 1], [0, 14]),
		}
	})
	const animatedOpacity = useAnimatedStyle(() => {
		const opacity = interpolate(animatedValue.value, [0, 1], [1, 0])
		return {
			opacity,
		}
	})
	return (
		<Pressable key={index} onPress={onPress} className='items-center justify-center p-2'>
			<ThemedView animated style={animatedScale} className='bg-transparent'>
				{icon}
			</ThemedView>
			<ThemedText animated style={animatedOpacity} className='bg-transparent'>
				{title}
			</ThemedText>
		</Pressable>
	)
}

function PlusButton() {
	const iconColor = useCSSVariable('--color-muted-foreground') as string
	const primaryForeground = useCSSVariable('--color-primary-foreground') as string
	const sheet = useBottomSheetModal()
	return (
		<BottomSheet>
			<BottomSheetTrigger className='rounded-full bg-primary p-2'>
				<HugeiconsIcon size={28} icon={PlusSignIcon} strokeWidth={2.8} color={primaryForeground} />
			</BottomSheetTrigger>
			<BottomSheetContent snapPoints={[200]}>
				<ThemedView className='w-full items-center justify-between bg-background p-4'>
					<Pressable
						className='m-1 w-full flex-1 flex-row items-center justify-center gap-2 rounded-md bg-input p-1'
						onPress={() => {
							sheet.dismiss()
							router.push('/dashboard/media')
						}}
					>
						<HugeiconsIcon icon={Album02Icon} size={28} color={iconColor} />
						<ThemedText>Select from gallery</ThemedText>
					</Pressable>
					<Pressable className='m-1 w-full flex-1 flex-row items-center justify-center gap-2 rounded-md bg-input p-1'>
						<HugeiconsIcon icon={Folder02Icon} size={28} color={iconColor} />
						<ThemedText>Select from storage</ThemedText>
					</Pressable>
				</ThemedView>
			</BottomSheetContent>
		</BottomSheet>
	)
}
