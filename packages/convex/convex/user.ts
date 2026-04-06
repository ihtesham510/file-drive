import { ConvexError } from 'convex/values'
import { internalQuery } from './_generated/server'

export const authUser = internalQuery({
	async handler(ctx) {
		const user = await ctx.auth.getUserIdentity()
		if (!user) throw new ConvexError('un-authenticated')
		return user
	},
})
