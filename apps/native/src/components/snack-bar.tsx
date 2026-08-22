import * as JetPackCompose from '@expo/ui/jetpack-compose'
import * as Modifiers from '@expo/ui/jetpack-compose/modifiers'
import { useEffect, useRef } from 'react'
import { useCSSVariable } from 'uniwind'
import { registerSnackBarRef } from '@/lib/snack-bar'

export function SnackBar() {
	const ref = useRef<JetPackCompose.SnackbarHostRef>(null)
	const [cardColor, cardForeGroundColor] = useCSSVariable([
		'--color-card',
		'--color-card-foreground',
	]) as string[]

	useEffect(() => {
		if (ref.current) {
			registerSnackBarRef(ref.current)
		}
		return () => registerSnackBarRef(null)
	}, [])

	return (
		<JetPackCompose.Box modifiers={[Modifiers.fillMaxSize()]}>
			<JetPackCompose.Box
				modifiers={[Modifiers.align('bottomCenter'), Modifiers.fillMaxWidth()]}
			>
				<JetPackCompose.SnackbarHost ref={ref}>
					<JetPackCompose.Snackbar
						containerColor={cardColor}
						contentColor={cardForeGroundColor}
						actionContentColor={cardForeGroundColor}
						dismissActionContentColor={cardForeGroundColor}
					/>
				</JetPackCompose.SnackbarHost>
			</JetPackCompose.Box>
		</JetPackCompose.Box>
	)
}
