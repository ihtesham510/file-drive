import { Pressable } from 'react-native'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'
import { authClient } from '@/lib/auth-client'

export default function Page() {
	const user = authClient.useSession()
	return (
		<ThemedView className='flex-1 items-center justify-center'>
			<ThemedText>{JSON.stringify(user.data?.user, null, 2)}</ThemedText>
			<Pressable onPress={async () => await authClient.signOut()}>
				<ThemedText>Log Out</ThemedText>
			</Pressable>
		</ThemedView>
	)
}
