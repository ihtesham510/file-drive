import {
	Files01Icon,
	Home01Icon,
	Settings04Icon,
	SharedDriveIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { Drawer } from 'expo-router/drawer'
import { CustomDrawer } from '@/components/dashboard/custom-drawer'
import { DrawerHeader } from '@/components/dashboard/drawer-header'

export default function DrawerLayout() {
	return (
		<Drawer
			drawerContent={props => <CustomDrawer {...props} />}
			screenOptions={{
				headerShown: true,
				header: props => <DrawerHeader {...props} />,
				drawerType: 'slide',
				swipeEdgeWidth: 60,
			}}
		>
			<Drawer.Screen
				name='index'
				options={{
					title: 'Home',
					drawerLabel: 'Home',
					drawerIcon: ({ size, color }) => (
						<HugeiconsIcon size={size} color={color} icon={Home01Icon} />
					),
				}}
			/>
			<Drawer.Screen
				name='(tabs)'
				options={{
					title: 'Files',
					drawerLabel: 'Files',
					drawerIcon: ({ size, color }) => (
						<HugeiconsIcon size={size} color={color} icon={Files01Icon} />
					),
				}}
			/>
			<Drawer.Screen
				name='shared'
				options={{
					title: 'Shared',
					drawerLabel: 'Shared',
					drawerIcon: ({ size, color }) => (
						<HugeiconsIcon size={size} color={color} icon={SharedDriveIcon} />
					),
				}}
			/>
			<Drawer.Screen
				name='settings'
				options={{
					title: 'Settings',
					drawerLabel: 'Settings',
					drawerIcon: ({ size, color }) => (
						<HugeiconsIcon size={size} color={color} icon={Settings04Icon} />
					),
				}}
			/>
		</Drawer>
	)
}
