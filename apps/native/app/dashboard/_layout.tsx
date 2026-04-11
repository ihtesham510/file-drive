import { Stack } from 'expo-router'

export default function Layout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name='(tabs)' />
			<Stack.Screen
				name='select-media'
				options={{
					presentation: 'formSheet',
					sheetElevation: 30,
					sheetCornerRadius: 30,
					sheetGrabberVisible: true,
					sheetAllowedDetents: [0.22],
				}}
			/>
		</Stack>
	)
}
