import type { TextProps } from 'react-native'
import { Text } from 'react-native'

export function ThemedText({
	varient = 'default',
	className = '',
	...props
}: TextProps & {
	varient?: 'default' | 'bold' | 'semiBold' | 'title'
}) {
	return <Text className={`text-foreground ${varients[varient]} ${className}`} {...props} />
}

const varients = {
	default: 'leading-8',
	bold: 'font-bold leading-8',
	semiBold: 'fold-semibold leading-8',
	title: 'text-2xl font-bold',
}
