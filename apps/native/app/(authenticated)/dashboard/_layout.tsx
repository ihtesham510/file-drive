import { Stack } from 'expo-router'

export default function DrawerLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name='(drawer)' />
			<Stack.Screen
				name='notifications'
				options={{
					presentation: 'modal',
					animation: 'slide_from_right',
				}}
			/>
			<Stack.Screen
				name='upload'
				options={{
					presentation: 'modal',
					animation: 'slide_from_bottom',
				}}
			/>
		</Stack>
	)
}
