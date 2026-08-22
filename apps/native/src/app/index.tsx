import { useQuery } from '@tanstack/react-query'
import { Text, View } from 'react-native'

export default function Page() {
	const query = useQuery({
		queryKey: ['test-query'],
		queryFn: async () => {
			throw new Error('error while getting query')
		},
	})
	return (
		<View className='flex-1 items-center justify-center'>
			<Text>Edit src/app/index.tsx to edit this screen.</Text>
		</View>
	)
}
