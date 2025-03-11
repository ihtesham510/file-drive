import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
	user: defineTable({
		id: v.string(),
		email: v.string(),
		first_name: v.string(),
		last_name: v.optional(v.string()),
		image_url: v.string(),
		username: v.optional(v.string()),
		tokenIdentifier: v.string(),
	}),
	org: defineTable({
		name: v.string(),
		image: v.optional(
			v.object({
				url: v.string(),
				storageId: v.id('_storage'),
			}),
		),
		users: v.array(
			v.object({
				userId: v.id('user'),
				role: v.union(v.literal('admin'), v.literal('member')),
			}),
		),
	}),
	invitation: defineTable({
		for: v.id('user'),
		org: v.id('org'),
	}),
})
