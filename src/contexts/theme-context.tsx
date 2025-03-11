import {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useState,
} from 'react'

export type Theme = 'dark' | 'light'
export interface ThemeContext {
	theme: Theme
	toggleTheme: () => void
}

export const themeContext = createContext<ThemeContext | null>(null)

export function ThemeProvider(props: PropsWithChildren) {
	const [theme, setTheme] = useState<Theme>(() => {
		if (
			!localStorage.getItem('theme') ||
			localStorage.getItem('theme') === 'dark'
		) {
			return 'dark'
		}
		return 'light'
	})
	const toggleTheme = useCallback(() => {
		setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
	}, [])
	return (
		<themeContext.Provider value={{ theme, toggleTheme }}>
			{props.children}
		</themeContext.Provider>
	)
}

export function useTheme() {
	const ctx = useContext(themeContext)
	if (!ctx)
		throw new Error(
			'Did you forgot to add ThemeProvider in your main.tsx file?',
		)
	return ctx
}
