import pushNotifications from '@convex-dev/expo-push-notifications/convex.config.js'
import { defineApp } from 'convex/server'
import betterAuth from './betterAuth/convex.config'

const app = defineApp()

app.use(betterAuth)
app.use(pushNotifications)

export default app
