import { ConvexError, v } from 'convex/values'
import { internalMutation, MutationCtx, QueryCtx } from './_generated/server'
export const createUser = internalMutation({
	args: {
		id: v.string(),
		email: v.string(),
		first_name: v.string(),
		last_name: v.optional(v.string()),
		image_url: v.string(),
		username: v.optional(v.string()),
		tokenIdentifier: v.string(),
	},
	async handler(ctx, args) {
		return await ctx.db.insert('user', args)
	},
})
export const updateUser = internalMutation({
	args: {
		id: v.string(),
		email: v.string(),
		first_name: v.optional(v.string()),
		last_name: v.optional(v.string()),
		image_url: v.string(),
		username: v.optional(v.string()),
		tokenIdentifier: v.string(),
	},
	async handler(ctx, args) {
		const user = await ctx.db
			.query('user')
			.filter(q => q.eq(q.field('id'), args.id))
			.first()
		if (!user) throw new ConvexError('User not found')
		return await ctx.db.patch(user._id, args)
	},
})

export const deleteUser = internalMutation({
	args: { id: v.string() },
	async handler(ctx, args) {
		const user = await ctx.db
			.query('user')
			.filter(q => q.eq(q.field('id'), args.id))
			.first()
		if (!user) throw new ConvexError('User not found')
		return await ctx.db.delete(user._id)
	},
})

export async function getUserIdentity(ctx: MutationCtx | QueryCtx) {
	const auth = await ctx.auth.getUserIdentity()
	if (!auth?.tokenIdentifier) {
		throw new ConvexError('tokenIdentifier not found')
	}
	const user = await ctx.db
		.query('user')
		.filter(q => q.eq(q.field('tokenIdentifier'), auth.tokenIdentifier))
		.first()
	if (!user) throw new ConvexError('user not found')
	return user
}
