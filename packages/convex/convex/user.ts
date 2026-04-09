import { ConvexError } from 'convex/values'
import { internalQuery, query } from './_generated/server'

export const authUser = internalQuery({
	async handler(ctx) {
		const user = await ctx.auth.getUserIdentity()
		if (!user) throw new ConvexError('un-authenticated')
		return user
	},
})

export const getAuthUser = query({
	async handler(ctx) {
		const user = await ctx.auth.getUserIdentity()
		if (!user) return null
		return user
	},
})
