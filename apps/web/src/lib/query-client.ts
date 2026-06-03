import {
	MutationCache,
	type QueryCache,
	QueryClient,
	type QueryKey,
} from '@tanstack/react-query'

export interface Message {
	type: 'info' | 'warn' | 'success' | 'error'
	message: string
}
declare module '@tanstack/react-query' {
	interface Register {
		mutationMeta: {
			onSuccess?: Message
			onError?: Message
			onSettled?: Message
			invalidateQueries?: QueryKey[]
		}
	}
}

export interface Opts {
	onSuccess?: (message: Message) => void
	onError?: (message: Message) => void
	queryCache?: QueryCache
	mutationCache?: MutationCache
}

export function getQueryClient(opts?: Opts) {
	return new QueryClient({
		queryCache: opts?.queryCache,
		mutationCache: new MutationCache({
			onSuccess(_data, _variables, _onMutateResult, _mutation, context) {
				const { meta } = context
				if (meta?.onSuccess && opts) {
					opts.onSuccess?.(meta.onSuccess)
				}
				opts?.mutationCache?.config.onSuccess?.(
					_data,
					_variables,
					_onMutateResult,
					_mutation,
					context,
				)
			},
			onSettled(
				_data,
				_error,
				_variables,
				_onMutateResult,
				_mutation,
				context,
			) {
				const { meta, client } = context
				if (meta?.invalidateQueries) {
					for (const queryKey of meta.invalidateQueries) {
						client.invalidateQueries({ queryKey })
					}
				}
				opts?.mutationCache?.config.onSettled?.(
					_data,
					_error,
					_variables,
					_onMutateResult,
					_mutation,
					context,
				)
			},
			onError(_error, _variables, _onMutateResult, _mutation, context) {
				const { meta } = context
				if (meta?.onError && opts) {
					opts.onError?.(meta.onError)
				}
				opts?.mutationCache?.config.onError?.(
					_error,
					_variables,
					_onMutateResult,
					_mutation,
					context,
				)
			},
			...opts?.mutationCache,
		}),
	})
}
