import { createContext, type PropsWithChildren, useContext } from 'react'
import { authClient } from '@/lib/auth-client'

interface OrganizationContext {
	activeOrg: ReturnType<typeof authClient.useActiveOrganization>['data']
	list: ReturnType<typeof authClient.useListOrganizations>['data']
	isLoading: boolean
	refresh: () => void
	refetchActiveOrg: () => void
	refetchList: () => void
	setActive: (id: string) => void
}

const context = createContext<OrganizationContext | null>(null)

export function OrganizationContextProvider({ children }: PropsWithChildren) {
	const {
		data: activeOrg,
		isRefetching: isRefetchingActiveOrg,
		isPending: isPendingActiveOrg,
		refetch: refetchActiveOrg,
	} = authClient.useActiveOrganization()
	const {
		data: list,
		isPending: isPendingList,
		isRefetching: isRefetchingList,
		refetch: refetchList,
	} = authClient.useListOrganizations()
	const isLoading =
		isPendingList || isPendingActiveOrg || isRefetchingList || isRefetchingActiveOrg
	async function refresh() {
		await refetchList()
		await refetchActiveOrg()
	}

	async function setActive(id: string) {
		await authClient.organization.setActive({ organizationId: id })
		await refetchActiveOrg()
	}
	return (
		<context.Provider
			value={{
				activeOrg,
				list,
				isLoading,
				refetchActiveOrg,
				refetchList,
				refresh,
				setActive,
			}}
		>
			{children}
		</context.Provider>
	)
}

export function useOrganization() {
	const ctx = useContext(context)
	if (!ctx) {
		throw new Error('useOrganization must be used inside the OrganizationContextProvider')
	}
	return ctx
}
