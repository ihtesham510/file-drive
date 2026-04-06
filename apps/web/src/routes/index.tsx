import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: RouteComponent,
	beforeLoad({ context: { session } }) {
		if (session.data?.user) {
			throw redirect({
				to: '/dashboard',
			})
		} else {
			throw redirect({
				to: '/sign-in',
			})
		}
	},
})

function RouteComponent() {
	return <div>Hello "/"!</div>
}
