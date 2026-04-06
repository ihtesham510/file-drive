import type { PropsWithChildren } from 'react'
import { View } from 'react-native'
import '@/global.css'

export function Main({ children }: PropsWithChildren) {
	return <View className='flex-1'>{children}</View>
}
