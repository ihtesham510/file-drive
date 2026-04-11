import { AccountSetting02Icon, ContactIcon, Home01Icon, UserGroupIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { Tabs } from 'expo-router'
import { TabBar } from '@/components/common/tab-bar'

export default function Layout() {
	// TODO: fix: white flashes while switching tabs in dark mode
	return (
		<Tabs screenOptions={{ headerShown: false }} tabBar={props => <TabBar {...props} />}>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Home',
					animation: 'shift',
					tabBarIcon: ({ color, size, focused }) => (
						<HugeiconsIcon icon={Home01Icon} color={color} size={size} strokeWidth={focused ? 2 : 1.4} />
					),
				}}
			/>
			<Tabs.Screen
				name='organizations'
				options={{
					title: 'Orgs',
					animation: 'shift',
					tabBarIcon: ({ color, size, focused }) => (
						<HugeiconsIcon icon={UserGroupIcon} color={color} size={size} strokeWidth={focused ? 2 : 1.4} />
					),
				}}
			/>
			<Tabs.Screen
				name='contacts'
				options={{
					title: 'Contacts',
					animation: 'shift',
					tabBarIcon: ({ color, size, focused }) => (
						<HugeiconsIcon icon={ContactIcon} color={color} size={size} strokeWidth={focused ? 2 : 1.4} />
					),
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					title: 'Profile',
					animation: 'shift',
					tabBarIcon: ({ color, size, focused }) => (
						<HugeiconsIcon icon={AccountSetting02Icon} color={color} size={size} strokeWidth={focused ? 2 : 1.4} />
					),
				}}
			/>
		</Tabs>
	)
}
