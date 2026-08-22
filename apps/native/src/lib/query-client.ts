import { QueryCache, QueryClient } from '@tanstack/react-query'
import { showSnackBar } from './snack-bar'

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		async onError({ message }, query) {
			await showSnackBar({
				message,
				actionLabel: 'Retry',
				onActionPerformed() {
					query.fetch()
				},
			})
		},
	}),
})
