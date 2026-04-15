import { useOrganization } from '@/context/organization-context'

export default function Page() {
	const { refetchList } = useOrganization()
	return <></>
}
