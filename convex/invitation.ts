import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { getUserIdentity } from './user'

// NOTE: if the org gets delelted before the user even checks the invitation then the invitation should be deleted with the org

export const getInvitations = query({
	async handler(ctx) {
		const user = await getUserIdentity(ctx)
		const invitations = await ctx.db
			.query('invitation')
			.filter(q => q.eq(q.field('for'), user._id))
			.collect()
		return await Promise.all(
			invitations.map(async invitation => {
				const org = await ctx.db.get(invitation.org)
				if (!org) throw new ConvexError('Org not found')
				return {
					...invitation,
					org: org,
				}
			}),
		)
	},
})

export const acceptInvitation = mutation({
	args: { invitationId: v.id('invitation') },
	async handler(ctx, args) {
		const user = await getUserIdentity(ctx)
		const invitation = await ctx.db.get(args.invitationId)
		if (!invitation) throw new ConvexError('Invitation not found')
		const org = await ctx.db.get(invitation.org)
		if (!org) throw new ConvexError('org not found')
		if (user._id === invitation.for) {
			await ctx.db.patch(org._id, {
				...org,
				users: [...org.users, { userId: user._id, role: 'member' }],
			})
		}
		return await ctx.db.delete(invitation._id)
	},
})

export const rejectInvitation = mutation({
	args: { invitationId: v.id('invitation') },
	async handler(ctx, { invitationId }) {
		return await ctx.db.delete(invitationId)
	},
})
