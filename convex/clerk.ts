import type { WebhookEvent } from '@clerk/clerk-sdk-node'
import { ConvexError, v } from 'convex/values'
import { Webhook } from 'svix'
import { internalAction } from './_generated/server'

const SECRET = process.env.WEBHOOK_SECRET
if (!SECRET) throw new ConvexError('No Webhook secret')

export const fulfill = internalAction({
	args: { headers: v.any(), payload: v.string() },
	handler: async (ctx, args) => {
		const wh = new Webhook(SECRET)
		const payload = wh.verify(args.payload, args.headers) as WebhookEvent
		return payload
	},
})
