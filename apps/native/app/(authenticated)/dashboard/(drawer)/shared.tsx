import { RefreshableContent } from '@/components/common/refreshable-content'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'
import App from '@/components/swipeable-example/example'

export default function Page() {
	return (
		<RefreshableContent>
			<App />
		</RefreshableContent>
	)
}
