import { defineSchema, defineTable } from 'convex/server'
import { type Infer, v } from 'convex/values'

export const fileSchema = v.object({
	name: v.string(),
	userId: v.string(),
	data: v.object({
		storageId: v.id('_storage'),
		type: v.string(),
		url: v.string(),
	}),
	org: v.optional(v.string()),
})

export type FileSchema = Infer<typeof fileSchema>

export default defineSchema({
	file: defineTable(fileSchema).index('by_userId', ['userId']).index('by_org', ['org']),
})
