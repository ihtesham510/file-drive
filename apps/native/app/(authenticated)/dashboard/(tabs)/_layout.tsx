import { Files01Icon, Folder02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { Tabs } from 'expo-router'
import { useCSSVariable } from 'uniwind'

export default function TabLayout() {
	const [activeColor] = useCSSVariable(['--color-primary']) as string[]
	return (
		<Tabs
			screenOptions={{ tabBarActiveTintColor: activeColor, headerShown: false }}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Home',
					tabBarIcon: ({ color }) => (
						<HugeiconsIcon icon={Files01Icon} size={18} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='favorites'
				options={{
					title: 'Media',
					tabBarIcon: ({ color }) => (
						<HugeiconsIcon icon={Folder02Icon} size={18} color={color} />
					),
				}}
			/>
		</Tabs>
	)
}
