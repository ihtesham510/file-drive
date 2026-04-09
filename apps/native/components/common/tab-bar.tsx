import { PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import type { NavigationRoute, ParamListBase } from '@react-navigation/native'
import { useEffect } from 'react'
import { Dimensions, Pressable } from 'react-native'
import { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useCSSVariable } from 'uniwind'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'

interface TabBarProps extends BottomTabBarProps {}

export function TabBar(props: TabBarProps) {
	function renderTabButton(index: number) {
		return <TabButton {...props} route={props.state.routes[index]} index={index} />
	}

	return (
		<ThemedView className='w-full items-center justify-center'>
			<ThemedView
				style={{
					width: Dimensions.get('window').width / 1.05,
				}}
				className='absolute bottom-6 mb-4 flex-row items-center justify-around rounded-full bg-card p-1'
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
	const activeColor = useCSSVariable('--primary') as string
	const inActiveColor = useCSSVariable('--foreground') as string

	const isFocused = props.state.index === index
	const { options } = props.descriptors[route.key]
	const icon = options.tabBarIcon?.({
		focused: isFocused,
		color: isFocused ? activeColor : inActiveColor,
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
			damping: 12,
			stiffness: 130,
			mass: 1,
			overshootClamping: false,
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
	return (
		<Pressable className='rounded-full bg-primary p-2'>
			<HugeiconsIcon size={28} icon={PlusSignIcon} strokeWidth={2.8} />
		</Pressable>
	)
}
