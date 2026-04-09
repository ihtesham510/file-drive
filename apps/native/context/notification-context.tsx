import { api } from '@repo/convex'
import { useAction } from 'convex/react'
import * as Notifications from 'expo-notifications'
import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { authClient } from '@/lib/auth-client'
import { registerForPushNotificationsAsync } from '@/utils/notification'

interface NotificationContext {
	token?: string
	channels: Notifications.NotificationChannel[]
	notification: Notifications.Notification | undefined
	error: Error | null
	schedulePushNotification: (delay: number) => void
}

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldPlaySound: true,
		shouldSetBadge: true,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
})

const context = createContext<NotificationContext | null>(null)

async function schedulePushNotification(delay: number = 2) {
	await Notifications.scheduleNotificationAsync({
		content: {
			title: "You've got mail! 📬",
			body: 'Here is the notification body',
			data: { data: 'goes here', test: { test1: 'more data' } },
		},
		trigger: {
			type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
			seconds: delay,
		},
	})
}

export function NotificationContextProvider({ children }: PropsWithChildren) {
	const registerToken = useAction(api.notification.recordPushNotificationToken)
	const session = authClient.useSession()
	const [token, setToken] = useState<string>()
	const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([])
	const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined)
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		registerForPushNotificationsAsync()
			.then(token => {
				if (token) {
					setToken(token)
				}
			})
			.catch(e => setError(e))

		if (Platform.OS === 'android') {
			Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []))
		}
		const notificationListener = Notifications.addNotificationReceivedListener(notification => {
			setNotification(notification)
		})

		const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
			console.log(response)
		})

		return () => {
			notificationListener.remove()
			responseListener.remove()
		}
	}, [])

	useEffect(() => {
		if (token && session.data?.user) {
			const id = session.data.user.id
			registerToken({ token, id })
		}
	}, [token, session.data?.user, registerToken])
	return <context.Provider value={{ token, channels, notification, error, schedulePushNotification }}>{children}</context.Provider>
}

export function useNotifications() {
	const ctx = useContext(context)
	if (!ctx) throw new Error('useNotifications must be used inside its provider')
	return ctx
}
