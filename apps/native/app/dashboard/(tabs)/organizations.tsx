import { LoadingScreen } from '@/components/common/loading-screen'
import { RefreshableContent } from '@/components/common/refreshable-content'
import { ThemedSafeAreaView } from '@/components/common/themed-safe-area-view'
import { ThemedView } from '@/components/common/themed-view'
import { NoOrganizationPresent } from '@/components/dashboard/organizations/no_organization'
import { OrganizationHeader } from '@/components/dashboard/organizations/organization-header'
import { OrganizationList } from '@/components/dashboard/organizations/organization-list'
import { useOrganization } from '@/context/organization-context'

export default function Page() {
	const { isLoading, list, activeOrg } = useOrganization()
	if (isLoading) {
		return <LoadingScreen />
	}
	if (!list || list?.length === 0) {
		return <NoOrganizationPresent />
	}
	return (
		<ThemedSafeAreaView>
			<RefreshableContent>
				<ThemedView className='flex-1'>
					{activeOrg ? <OrganizationHeader /> : <OrganizationList />}
				</ThemedView>
			</RefreshableContent>
		</ThemedSafeAreaView>
	)
}
