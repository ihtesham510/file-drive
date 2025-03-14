import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { getUserIdentity } from './user'

export const createOrg = mutation({
	args: {
		name: v.string(),
		image: v.optional(
			v.object({
				url: v.string(),
				storageId: v.id('_storage'),
			}),
		),
		emails: v.array(v.string()),
	},
	async handler(ctx, { name, image, emails }) {
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
			image,
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
			.map(({ _id, _creationTime, name, image, users }) => ({
				_id,
				_creationTime,
				name,
				image,
				_credentials: users.find(u => u.userId === user._id)!.role,
			}))
	},
})

export const updateOrg = mutation({
	args: {
		id: v.id('org'),
		name: v.optional(v.string()),
		image: v.optional(
			v.object({
				url: v.string(),
				storageId: v.id('_storage'),
			}),
		),
	},
	async handler(ctx, args) {
		const org = await ctx.db.get(args.id)
		if (org?.image && args.image) {
			await ctx.storage.delete(org.image.storageId)
		}
		return ctx.db.patch(args.id, {
			name: args.name ?? org?.name,
			image: args.image ?? org?.image,
			users: org?.users,
		})
	},
})
