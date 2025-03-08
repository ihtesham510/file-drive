import { useState, useEffect } from 'react'

export function useMemorizedState<T>(key: string, initialValue: T) {
	const [state, setState] = useState<T>(() => {
		try {
			const storedValue = localStorage.getItem(key)
			return storedValue ? (JSON.parse(storedValue) as T) : initialValue
		} catch (error) {
			console.error('Error parsing localStorage value:', error)
			return initialValue
		}
	})

	useEffect(() => {
		try {
			if (!state) {
				localStorage.removeItem(key)
			} else {
				localStorage.setItem(key, JSON.stringify(state))
			}
		} catch (error) {
			console.error('Error saving to localStorage:', error)
		}
	}, [key, state])

	return [state, setState] as const
}
