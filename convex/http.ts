import { httpRouter } from 'convex/server'

import { internal } from './_generated/api'
import { httpAction } from './_generated/server'

const http = httpRouter()

http.route({
	path: '/clerk',
	method: 'POST',
	handler: httpAction(async (ctx, request) => {
		const payloadString = await request.text()
		const headerPayload = request.headers

		try {
			const result = await ctx.runAction(internal.clerk.fulfill, {
				payload: payloadString,
				headers: {
					'svix-id': headerPayload.get('svix-id')!,
					'svix-timestamp': headerPayload.get('svix-timestamp')!,
					'svix-signature': headerPayload.get('svix-signature')!,
				},
			})

			switch (result.type) {
				case 'user.created':
					if (result.data.first_name) {
						await ctx.runMutation(internal.user.createUser, {
							first_name: result.data.first_name,
							id: result.data.id,
							email: result.data.email_addresses[0].email_address,
							image_url: result.data.image_url,
							last_name: result.data.last_name ?? undefined,
							username: result.data.username ?? result.data.first_name,
							tokenIdentifier: `${process.env.CLERK_ISSUER_URL}|${result.data.id}`,
						})
					}
					break
				case 'user.updated':
					if (result.data.first_name) {
						await ctx.runMutation(internal.user.updateUser, {
							first_name: result.data.first_name,
							id: result.data.id,
							email: result.data.email_addresses[0].email_address,
							image_url: result.data.image_url,
							last_name: result.data.last_name ?? undefined,
							username: result.data.username ?? result.data.first_name,
							tokenIdentifier: `${process.env.CLERK_ISSUER_URL}|${result.data.id}`,
						})
					}
					break
				case 'user.deleted':
					if (result.data.id && result.data.deleted) {
						await ctx.runMutation(internal.user.deleteUser, {
							id: result.data.id,
						})
					}
					break
			}
			return new Response(null, {
				status: 200,
			})
		} catch (err) {
			return new Response('Webhook Error', {
				status: 400,
			})
		}
	}),
})

export default http
