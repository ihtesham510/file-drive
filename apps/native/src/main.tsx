import { QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import './global.css'

import { Host } from '@expo/ui/jetpack-compose'
import { withUniwind } from 'uniwind'
import { SnackBar } from './components/snack-bar'
import { queryClient } from './lib/query-client'

const StyledHost = withUniwind(Host)

export function Main({ children }: PropsWithChildren) {
	return (
		<QueryClientProvider client={queryClient}>
			<StyledHost className='flex-1'>
				<KeyboardProvider>
					<SafeAreaProvider>{children}</SafeAreaProvider>
				</KeyboardProvider>
				<SnackBar />
			</StyledHost>
		</QueryClientProvider>
	)
}
