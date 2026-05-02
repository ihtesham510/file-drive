import {
	MutationCache,
	QueryClient,
	type QueryKey,
} from '@tanstack/react-query'

declare module '@tanstack/react-query' {
	interface Register {
		mutationMeta: {
			queryKey?: QueryKey
			queryKeys?: QueryKey[]
			errorLog?: string
			successLog?: string
			setQueryData?: { updater: (data: unknown) => unknown; queryKey: QueryKey }
		}
	}
}

export const queryClient = new QueryClient({
	mutationCache: new MutationCache({
		onMutate(_variables, _mutation, _context) {
			if (_context.meta?.setQueryData) {
				const { queryKey, updater } = _context.meta.setQueryData
				queryClient.setQueryData(
					queryKey,
					updater(queryClient.getQueryData(queryKey)),
				)
			}
		},
		onSuccess(_data, _variables, _onMutateResult, _mutation, _context) {
			if (_context.meta?.successLog) {
				console.log(_context.meta?.successLog)
			}
		},
		onError(_error, _variables, _onMutateResult, _mutation, _context) {
			if (_context.meta?.errorLog) {
				console.log(_context.meta?.errorLog)
			}
		},
		onSettled(_data, _variables, _onMutateResult, _mutation, _context) {
			if (_context.meta?.queryKey) {
				queryClient.invalidateQueries({ queryKey: _context.meta?.queryKey })
			}
			if (_context.meta?.queryKeys) {
				for (const queryKey of _context.meta.queryKeys) {
					queryClient.invalidateQueries({ queryKey })
				}
			}
		},
	}),
})
