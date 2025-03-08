import { useMemorizedState } from '@/hooks/use-memorized-state'
import { useOrg } from '@/hooks/use-org'
import { OrgType } from '@/lib/types'
import { Id } from '@convex/_generated/dataModel'
import {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
} from 'react'
type Org = Id<'org'> | null
interface OrgContext {
	currentOrg: OrgType | null
	setCurrentOrg: (value: Org) => void
}

export const orgContext = createContext<OrgContext | null>(null)

export function OrgContextProvider(props: PropsWithChildren) {
	const [org, setOrg] = useMemorizedState<Org>('org', null)
	const { orgs } = useOrg()
	const setCurrentOrg = useCallback(
		(value: Org) => {
			setOrg(value)
		},
		[org],
	)
	return (
		<orgContext.Provider
			value={{
				currentOrg: orgs?.find(o => o._id === org) ?? null,
				setCurrentOrg,
			}}
		>
			{props.children}
		</orgContext.Provider>
	)
}

export function useOrgState() {
	const ctx = useContext(orgContext)
	if (!ctx)
		throw new Error('did you forgot to add org context provider in main.tsx ?')
	return ctx
}
