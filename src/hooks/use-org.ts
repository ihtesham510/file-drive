import { api } from '@convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'

export function useOrg() {
	const invitations = useQuery(api.invitation.getInvitations)
	const acceptInvitation = useMutation(api.invitation.acceptInvitation)
	const rejectInvitation = useMutation(api.invitation.rejectInvitation)
	const createOrg = useMutation(api.org.createOrg)
	const orgs = useQuery(api.org.getOrgs)
	const updateOrg = useMutation(api.org.updateOrg)
	return {
		invitations,
		acceptInvitation,
		rejectInvitation,
		createOrg,
		orgs,
		updateOrg,
	}
}
