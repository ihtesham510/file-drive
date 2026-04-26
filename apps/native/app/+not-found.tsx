import { Link, Stack } from 'expo-router'
import { Text, View } from 'react-native'

import { Container } from '@/components/common/container'

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options={{ title: 'Not Found' }} />
			<Container>
				<View className="flex-1 items-center justify-center p-4">
					<View className="max-w-sm items-center rounded-lg p-6">
						<Text className="mb-3 text-4xl">🤔</Text>
						<Text className="mb-1 font-medium text-foreground text-lg">
							Page Not Found
						</Text>
						<Text className="mb-4 text-center text-muted text-sm">
							The page you're looking for doesn't exist.
						</Text>
						<Link href="/" asChild>
							<Text>Go Home</Text>
						</Link>
					</View>
				</View>
			</Container>
		</>
	)
}
