import { v } from 'convex/values'
import { action, internalMutation } from './_generated/server'

export const getUploadUrl = action({
	async handler(ctx) {
		return await ctx.storage.generateUploadUrl()
	},
})

export const getFileUrl = action({
	args: {
		storageId: v.id('_storage'),
	},
	async handler(ctx, args) {
		return await ctx.storage.getUrl(args.storageId)
	},
})

export const deleteFile = internalMutation({
	args: {
		stroage_id: v.id('_storage'),
	},
	async handler(ctx, args) {
		return await ctx.storage.delete(args.stroage_id)
	},
})
