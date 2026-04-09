import { config } from 'dotenv'

config({ path: './.env.local' })

if (process.env.CONVEX_SELF_HOSTED_URL) {
	await Bun.write(
		'./packages/convex/.env.local',
		`CONVEX_URL='${process.env.CONVEX_SELF_HOSTED_URL}'\n CONVEX_SITE_URL='${process.env.CONVEX_SITE_URL}'\n CONVEX_SELF_HOSTED_ADMIN_KEY='${process.env.CONVEX_SELF_HOSTED_ADMIN_KEY}'\n`,
	)

	await Bun.write(
		'./apps/native/.env.local',
		`EXPO_PUBLIC_CONVEX_URL='${process.env.CONVEX_SELF_HOSTED_URL}'\n EXPO_PUBLIC_CONVEX_SITE_URL='${process.env.CONVEX_SITE_URL}'\n`,
	)

	await Bun.write(
		'./apps/web/.env.local',
		`VITE_CONVEX_DEPLOYMENT='${process.env.CONVEX_DEPLOYMENT}'\n VITE_CONVEX_URL='${process.env.CONVEX_URL}'\n VITE_CONVEX_SITE_URL='${process.env.CONVEX_SITE_URL}'\n`,
	)
} else {
	await Bun.write(
		'./packages/convex/.env.local',
		`CONVEX_DEPLOYMENT='${process.env.CONVEX_DEPLOYMENT}'\n CONVEX_URL='${process.env.CONVEX_URL}'\n CONVEX_SITE_URL='${process.env.CONVEX_SITE_URL}'\n`,
	)

	await Bun.write(
		'./apps/native/.env.local',
		`EXPO_PUBLIC_CONVEX_DEPLOYMENT='${process.env.CONVEX_DEPLOYMENT}'\n EXPO_PUBLIC_CONVEX_URL='${process.env.CONVEX_URL}'\n EXPO_PUBLIC_CONVEX_SITE_URL='${process.env.CONVEX_SITE_URL}'\n`,
	)

	await Bun.write(
		'./apps/web/.env.local',
		`VITE_CONVEX_DEPLOYMENT='${process.env.CONVEX_DEPLOYMENT}'\n VITE_CONVEX_URL='${process.env.CONVEX_URL}'\n VITE_CONVEX_SITE_URL='${process.env.CONVEX_SITE_URL}'\n`,
	)
}
