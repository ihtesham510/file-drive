import { createFileRoute, Link } from '@tanstack/react-router'
import { SignInButton, SignOutButton } from '@clerk/clerk-react'
import { Authenticated, Unauthenticated } from 'convex/react'
import { Button } from '@/components/ui/button'
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button'

export const Route = createFileRoute('/')({
	component: HomeComponent,
})

function HomeComponent() {
	return (
		<div className='p-2'>
			<Authenticated>
				<SignOutButton>
					<Button>Sign Out</Button>
				</SignOutButton>
				<Link to='/dashboard'>
					<InteractiveHoverButton>Go To Dashboard</InteractiveHoverButton>
				</Link>
			</Authenticated>
			<Unauthenticated>
				<SignInButton forceRedirectUrl='/dashboard'>
					<Button>Sign In</Button>
				</SignInButton>
			</Unauthenticated>
		</div>
	)
}
