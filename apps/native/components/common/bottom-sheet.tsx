import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	type BottomSheetModalProps,
	BottomSheetView,
} from '@gorhom/bottom-sheet'
import {
	createContext,
	type PropsWithChildren,
	useCallback,
	useContext,
	useRef,
} from 'react'
import type { PressableProps, StyleProp, ViewStyle } from 'react-native'
import { Pressable, StyleSheet } from 'react-native'
import { useCSSVariable } from 'uniwind'

export { BottomSheetScrollView } from '@gorhom/bottom-sheet'

interface BottonSheetContext {
	ref: React.RefObject<BottomSheetModal | null>
	open: () => void
	close: () => void
}

interface BottomSheetProps extends Omit<BottomSheetModalProps, 'snapPoints'> {
	children: React.ReactNode
	view?: StyleProp<ViewStyle>
	snapPoints?: (string | number)[]
}

const context = createContext<BottonSheetContext | null>(null)

export function BottomSheet(props: PropsWithChildren) {
	const ref = useRef<BottomSheetModal>(null)
	const open = useCallback(() => ref.current?.present(), [])
	const close = useCallback(() => ref.current?.dismiss(), [])
	return (
		<context.Provider value={{ ref, open, close }}>{props.children}</context.Provider>
	)
}

function useBottonSheet() {
	const ctx = useContext(context)
	if (!ctx) throw new Error('Bottom sheet must be used inside its context')
	return ctx
}

export function BottomSheetContent(props: BottomSheetProps) {
	const { ref } = useBottonSheet()
	const background = useCSSVariable('--color-background') as string
	const cardForeground = useCSSVariable('--color-card-foreground') as string

	const renderBackdrop = useCallback(
		(backdropProps: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...backdropProps}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
				pressBehavior='close'
			/>
		),
		[],
	)

	const styles = StyleSheet.create({
		contentContainer: {
			flex: 1,
			alignItems: 'center',
			backgroundColor: background,
		},
		handle: {
			backgroundColor: background,
			borderTopLeftRadius: 30,
			borderTopRightRadius: 30,
		},
		indicator: {
			backgroundColor: cardForeground,
		},
		sheetBackground: {
			backgroundColor: background,
			borderTopLeftRadius: 30,
			borderTopRightRadius: 30,
		},
	})

	const snapPoints = props.snapPoints ?? [300]

	return (
		<BottomSheetModal
			{...props}
			ref={ref}
			snapPoints={snapPoints}
			enableDynamicSizing={false}
			stackBehavior='push'
			backdropComponent={renderBackdrop}
			handleStyle={[styles.handle, props.handleStyle]}
			handleIndicatorStyle={[styles.indicator, props.handleIndicatorStyle]}
			backgroundStyle={[styles.sheetBackground, props.backgroundStyle]}
			onChange={(e, position, type) => {
				props.onChange?.(e, position, type)
			}}
		>
			<BottomSheetView style={[styles.contentContainer, props.view]}>
				{props.children}
			</BottomSheetView>
		</BottomSheetModal>
	)
}

export function BottomSheetTrigger(props: PressableProps) {
	const { open } = useBottonSheet()
	return (
		<Pressable
			{...props}
			onPress={e => {
				open()
				props.onPress?.(e)
			}}
		/>
	)
}
