import { PushNotifications } from '@convex-dev/expo-push-notifications'
import { v } from 'convex/values'
import { components } from './_generated/api'
import { action, mutation } from './_generated/server'

const pushNotifications = new PushNotifications<string>(components.pushNotifications, {
	logLevel: 'DEBUG',
})

export const recordPushNotificationToken = action({
	args: { token: v.string(), id: v.string() },
	handler: async (ctx, args) => {
		await pushNotifications.recordToken(ctx, {
			userId: args.id,
			pushToken: args.token,
		})
	},
})

export const sendPushNotification = mutation({
	args: { title: v.string(), to: v.string() },
	handler: async (ctx, args) => {
		return await pushNotifications.sendPushNotification(ctx, {
			userId: args.to,
			notification: {
				title: args.title,
			},
		})
	},
})
