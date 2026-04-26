import { zodResolver } from '@hookform/resolvers/zod'
import { ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { router } from 'expo-router'
import { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, TextInput } from 'react-native'
import {
	KeyboardAwareScrollView,
	KeyboardToolbar,
} from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCSSVariable, withUniwind } from 'uniwind'
import z from 'zod'
import { Spinner } from '@/components/common/spinner'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'
import { authClient } from '@/lib/auth-client'

const StyledKeyboardAwareScrollView = withUniwind(KeyboardAwareScrollView)
const StyledTextInput = withUniwind(TextInput)

const schema = z
	.object({
		email: z.email('Please provide a valid email address'),
		name: z.string().min(2, 'Name must be at least (2) characters long'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z
			.string()
			.min(8, 'Password must be at least 8 characters'),
	})
	.superRefine((args, ctx) => {
		if (args.password !== args.confirmPassword) {
			ctx.addIssue({
				code: 'custom',
				path: ['confirmPassword'],
				message: 'Passwords do not match',
			})
		}
	})

type SignUpFormValues = z.infer<typeof schema>

export function SignUp() {
	const passwordRef = useRef<TextInput>(null)
	const confirmPasswordRef = useRef<TextInput>(null)
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const [placeHolderColor] = useCSSVariable([
		'--color-muted-foreground',
	]) as string[]
	const safeAreaInsets = useSafeAreaInsets()

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignUpFormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: '',
			name: '',
			password: '',
			confirmPassword: '',
		},
	})

	const onSubmit = async (data: SignUpFormValues) => {
		await authClient.signUp.email({
			email: data.email,
			name: data.name,
			password: data.password,
		})
	}

	return (
		<ThemedView className="flex-1">
			<StyledKeyboardAwareScrollView
				className="flex-1 bg-background"
				style={{ marginTop: safeAreaInsets.top }}
				keyboardShouldPersistTaps="handled"
				bottomOffset={80}
				contentContainerStyle={{ flexGrow: 1 }}
			>
				<ThemedView className="flex-1 items-center justify-center px-6">
					<ThemedView className="mb-8 w-full">
						<ThemedText varient="semiBold" className="mb-1 text-3xl">
							Create account
						</ThemedText>
						<ThemedText className="text-muted-foreground text-sm">
							Fill in the details below to get started
						</ThemedText>
					</ThemedView>

					<ThemedView className="w-full gap-5">
						<ThemedView className="gap-1.5">
							<ThemedText varient="semiBold" className="text-sm">
								Email
							</ThemedText>
							<Controller
								control={control}
								name="email"
								render={({ field: { onChange, onBlur, value } }) => (
									<StyledTextInput
										className="rounded-xl border border-border bg-input px-4 py-3 text-foreground"
										placeholder="you@example.com"
										placeholderTextColor={placeHolderColor}
										keyboardType="email-address"
										autoCapitalize="none"
										autoCorrect={false}
										returnKeyType="next"
										onSubmitEditing={() => passwordRef.current?.focus()}
										onBlur={onBlur}
										onChangeText={onChange}
										value={value}
									/>
								)}
							/>
							{errors.email && (
								<ThemedText className="mt-0.5 text-destructive text-xs">
									{errors.email.message}
								</ThemedText>
							)}
						</ThemedView>
						<ThemedView className="gap-1.5">
							<ThemedText varient="semiBold" className="text-sm">
								Name
							</ThemedText>
							<Controller
								control={control}
								name="name"
								render={({ field: { onChange, onBlur, value } }) => (
									<StyledTextInput
										className="rounded-xl border border-border bg-input px-4 py-3 text-foreground"
										placeholder="you@example.com"
										placeholderTextColor={placeHolderColor}
										keyboardType="email-address"
										autoCapitalize="none"
										autoCorrect={false}
										returnKeyType="next"
										onSubmitEditing={() => passwordRef.current?.focus()}
										onBlur={onBlur}
										onChangeText={onChange}
										value={value}
									/>
								)}
							/>
							{errors.name && (
								<ThemedText className="mt-0.5 text-destructive text-xs">
									{errors.name.message}
								</ThemedText>
							)}
						</ThemedView>

						<ThemedView className="gap-1.5">
							<ThemedText varient="semiBold" className="text-sm">
								Password
							</ThemedText>
							<ThemedView className="relative">
								<Controller
									control={control}
									name="password"
									render={({ field: { onChange, onBlur, value } }) => (
										<StyledTextInput
											ref={passwordRef}
											className="rounded-xl border border-border bg-input px-4 py-3 pr-12 text-foreground"
											placeholder="••••••••"
											placeholderTextColor={placeHolderColor}
											secureTextEntry={!showPassword}
											autoCapitalize="none"
											autoCorrect={false}
											returnKeyType="next"
											onSubmitEditing={() =>
												confirmPasswordRef.current?.focus()
											}
											onBlur={onBlur}
											onChangeText={onChange}
											value={value}
										/>
									)}
								/>
								<Pressable
									className="absolute top-0 right-3 bottom-0 justify-center px-1"
									onPress={() => setShowPassword(v => !v)}
								>
									<HugeiconsIcon
										icon={showPassword ? ViewOffIcon : ViewIcon}
										size={18}
									/>
								</Pressable>
							</ThemedView>
							{errors.password && (
								<ThemedText className="mt-0.5 text-destructive text-xs">
									{errors.password.message}
								</ThemedText>
							)}
						</ThemedView>

						{/* ── Confirm Password ── */}
						<ThemedView className="gap-1.5">
							<ThemedText varient="semiBold" className="text-sm">
								Confirm Password
							</ThemedText>
							<ThemedView className="relative">
								<Controller
									control={control}
									name="confirmPassword"
									render={({ field: { onChange, onBlur, value } }) => (
										<StyledTextInput
											ref={confirmPasswordRef}
											className="rounded-xl border border-border bg-input px-4 py-3 pr-12 text-foreground"
											placeholder="••••••••"
											placeholderTextColor={placeHolderColor}
											secureTextEntry={!showConfirmPassword}
											autoCapitalize="none"
											autoCorrect={false}
											returnKeyType="done"
											onSubmitEditing={handleSubmit(onSubmit)}
											onBlur={onBlur}
											onChangeText={onChange}
											value={value}
										/>
									)}
								/>
								<Pressable
									className="absolute top-0 right-3 bottom-0 justify-center px-1"
									onPress={() => setShowConfirmPassword(v => !v)}
								>
									<HugeiconsIcon
										icon={showConfirmPassword ? ViewOffIcon : ViewIcon}
										size={18}
									/>
								</Pressable>
							</ThemedView>
							{errors.confirmPassword && (
								<ThemedText className="mt-0.5 text-destructive text-xs">
									{errors.confirmPassword.message}
								</ThemedText>
							)}
						</ThemedView>

						<Pressable
							className="mt-2 items-center rounded-xl bg-primary py-3.5"
							onPress={handleSubmit(onSubmit)}
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<Spinner size={18} />
							) : (
								<ThemedText
									varient="semiBold"
									className="text-base text-primary-foreground"
								>
									Create account
								</ThemedText>
							)}
						</Pressable>
					</ThemedView>

					{/* Footer */}
					<ThemedView className="mt-8 flex-row gap-1">
						<ThemedText className="text-muted-foreground text-sm">
							Already have an account?
						</ThemedText>
						<Pressable onPress={() => router.replace('/sign-in')}>
							<ThemedText varient="semiBold" className="text-primary text-sm">
								Sign in
							</ThemedText>
						</Pressable>
					</ThemedView>
				</ThemedView>
			</StyledKeyboardAwareScrollView>
			<KeyboardToolbar />
		</ThemedView>
	)
}
