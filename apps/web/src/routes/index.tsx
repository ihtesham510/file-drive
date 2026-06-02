import { createFileRoute, Link } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/')({
	component: () => {
		const session = authClient.useSession()
		return (
			<div className='flex h-screen w-full items-center justify-center'>
				{session.data?.session ? (
					<Link to='/dashboard'>
						<p>Go to dashboard</p>
					</Link>
				) : (
					<Link to='/login'>
						<p>Log in</p>
					</Link>
				)}
			</div>
		)
	},
})
