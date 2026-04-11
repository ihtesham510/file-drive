import { SafeAreaView } from 'react-native-safe-area-context'
import { withUniwind } from 'uniwind'
import { cn } from '@/utils/tw'

const StyledSafeAreaView = withUniwind(SafeAreaView)

export function ThemedSafeAreaView(props: React.ComponentProps<typeof StyledSafeAreaView>) {
	return <StyledSafeAreaView className={cn('flex-1 bg-background', props.className)} {...props} />
}
