import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { getUserIdentity } from './user'

export const createOrg = mutation({
	args: {
		name: v.string(),
		image_url: v.optional(v.string()),
		emails: v.array(v.string()),
	},
	async handler(ctx, { name, image_url, emails }) {
		const user = await getUserIdentity(ctx)
		const users = await Promise.all(
			emails.map(
				async email =>
					await ctx.db
						.query('user')
						.filter(q => q.eq(q.field('email'), email))
						.first(),
			),
		)
		const members = users
			.filter(q => q !== null)
			.filter(q => q.email !== user.email)
		const org = await ctx.db.insert('org', {
			name,
			image_url,
			users: [{ userId: user._id, role: 'admin' }],
		})
		for (const member of members) {
			await ctx.db.insert('invitation', {
				for: member._id,
				org: org,
			})
		}
		return org
	},
})

export const getUploadUrl = mutation({
	async handler(ctx) {
		return await ctx.storage.generateUploadUrl()
	},
})
export const getUrl = mutation({
	args: { storageId: v.id('_storage') },
	async handler(ctx, { storageId }) {
		return await ctx.storage.getUrl(storageId)
	},
})
export const organizationExists = query({
	args: { name: v.string() },
	async handler(ctx, args) {
		return !!(await ctx.db
			.query('org')
			.filter(q => q.eq(q.field('name'), args.name.trim()))
			.first())
	},
})

export const getOrgs = query({
	async handler(ctx) {
		const user = await getUserIdentity(ctx)
		const orgs = await ctx.db.query('org').collect()
		return orgs
			.filter(org => org.users.some(u => u.userId === user._id))
			.map(({ _id, _creationTime, name, image_url }) => ({
				_id,
				_creationTime,
				name,
				image_url,
			}))
	},
})

export const updateOrg = mutation({
	args: {
		id: v.id('org'),
		name: v.optional(v.string()),
		image_url: v.optional(v.string()),
	},
	async handler(ctx, args) {
		const org = await ctx.db.get(args.id)
		return ctx.db.patch(args.id, {
			name: args.name ?? org?.name,
			image_url: args.image_url ?? org?.image_url,
			users: org?.users,
		})
	},
})
