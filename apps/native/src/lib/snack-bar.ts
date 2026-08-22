import type {
	SnackbarHostRef,
	SnackbarShowOptions,
} from '@expo/ui/jetpack-compose'

let snackBar: SnackbarHostRef | null = null

export function registerSnackBarRef(ref: SnackbarHostRef | null) {
	snackBar = ref
}

export async function showSnackBar(
	options: SnackbarShowOptions & {
		onActionPerformed?: () => void
		onDismiss?: () => void
	},
) {
	const result = await snackBar?.showSnackbar(options)
	if (result === 'actionPerformed') {
		options.onActionPerformed?.()
	}
	if (result === 'dismissed') {
		options.onDismiss?.()
	}
}
