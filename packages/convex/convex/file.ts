import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { internal } from './_generated/api'
import { mutation, query } from './_generated/server'
import { fileSchema } from './schema'

export const getFiles = query({
	args: {
		org: v.optional(v.string()),
		paginationOpts: paginationOptsValidator,
	},
	async handler(ctx, { org, paginationOpts }) {
		const user = await ctx.runQuery(internal.user.authUser)
		const token: string = user.tokenIdentifier
		return await ctx.db
			.query('file')
			.withIndex(org ? 'by_org' : 'by_userId', q => (org ? q.eq('org', org) : q.eq('userId', token)))
			.paginate(paginationOpts)
	},
})

export const createFile = mutation({
	args: fileSchema.omit('userId'),
	async handler(ctx, file) {
		const user = await ctx.runQuery(internal.user.authUser)
		const token: string = user.tokenIdentifier
		return await ctx.db.insert('file', { ...file, userId: token })
	},
})

export const deleteFile = mutation({
	args: {
		file_id: v.id('file'),
	},
	async handler(ctx, { file_id }) {
		const file = await ctx.db.get('file', file_id)
		if (!file) return
		await ctx.runMutation(internal.storage.deleteFile, {
			stroage_id: file.data.storageId,
		})
		return await ctx.db.delete('file', file._id)
	},
})

export const deleteFiles = mutation({
	args: {
		file_ids: v.array(v.id('file')),
	},
	async handler(ctx, { file_ids }) {
		for (const file_id of file_ids) {
			const file = await ctx.db.get('file', file_id)
			if (!file) return
			try {
				await ctx.runMutation(internal.storage.deleteFile, {
					stroage_id: file.data.storageId,
				})
			} catch (_err) {
				console.error('error while deleting from bucket')
			}
			await ctx.db.delete('file', file._id)
		}
	},
})
