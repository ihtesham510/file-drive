import { ThemedSafeAreaView } from '@/components/common/themed-safe-area-view'
import { PermissionNotGranted } from '@/components/dashboard/common/permission-status'

export default function Page() {
	return (
		<ThemedSafeAreaView>
			<PermissionNotGranted />
		</ThemedSafeAreaView>
	)
}
