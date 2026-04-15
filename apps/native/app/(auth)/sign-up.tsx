import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, Text, TextInput, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import z from 'zod'
import { GoogleSignIn } from '@/components/auth/google-sign-in'
import * as themedText from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'
import { cn } from '@/utils/tw'

const schema = z
	.object({
		name: z.string().min(2, 'Name must be at least 2 characters'),
		email: z.email('Invalid email address'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	})

type FormData = z.infer<typeof schema>

export default function SignUpPage() {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	})

	const onSubmit = (data: FormData) => {
		console.log('Sign up:', data)
	}

	return (
		<ThemedView className='flex-1 bg-background'>
			<KeyboardAwareScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				keyboardShouldPersistTaps='handled'
				showsVerticalScrollIndicator={false}
			>
				<View className='flex-1 px-6'>
					{/* Header */}
					<View className='mt-16 mb-8'>
						<themedText.ThemedText className='mb-1 font-bold text-3xl text-foreground tracking-tight'>
							Create account
						</themedText.ThemedText>
						<themedText.ThemedText className='text-muted-foreground text-sm'>
							Start your journey today
						</themedText.ThemedText>
					</View>

					{/* Social Logins */}
					<GoogleSignIn buttonViewProps={{ className: 'mb-4' }} />

					{/* Divider */}
					<View className='mb-6 flex-row items-center gap-3'>
						<View className='h-px flex-1 bg-border' />
						<Text className='font-medium text-muted-foreground text-xs'>or</Text>
						<View className='h-px flex-1 bg-border' />
					</View>

					{/* Form */}
					<View className='gap-5'>
						{/* Name */}
						<View className='gap-1.5'>
							<Text className='font-medium text-foreground text-sm'>Full name</Text>
							<Controller
								control={control}
								name='name'
								render={({ field: { onChange, onBlur, value } }) => (
									<TextInput
										className={cn(
											'rounded-xl border bg-input px-4 py-3.5 text-foreground text-sm dark:bg-input/30',
											errors.name ? 'border-destructive' : 'border-border',
										)}
										placeholder=''
										placeholderTextColor='hsl(var(--muted-foreground))'
										autoCapitalize='words'
										autoCorrect={false}
										onBlur={onBlur}
										onChangeText={onChange}
										value={value}
									/>
								)}
							/>
							{errors.name && (
								<Text className='text-destructive text-xs'>{errors.name.message}</Text>
							)}
						</View>

						{/* Email */}
						<View className='gap-1.5'>
							<Text className='font-medium text-foreground text-sm'>Email</Text>
							<Controller
								control={control}
								name='email'
								render={({ field: { onChange, onBlur, value } }) => (
									<TextInput
										className={cn(
											'rounded-xl border bg-input px-4 py-3.5 text-foreground text-sm dark:bg-input/30',
											errors.email ? 'border-destructive' : 'border-border',
										)}
										placeholder='you@example.com'
										placeholderTextColor='hsl(var(--muted-foreground))'
										keyboardType='email-address'
										autoCapitalize='none'
										autoCorrect={false}
										onBlur={onBlur}
										onChangeText={onChange}
										value={value}
									/>
								)}
							/>
							{errors.email && (
								<Text className='text-destructive text-xs'>{errors.email.message}</Text>
							)}
						</View>

						{/* Password */}
						<View className='gap-1.5'>
							<Text className='font-medium text-foreground text-sm'>Password</Text>
							<Controller
								control={control}
								name='password'
								render={({ field: { onChange, onBlur, value } }) => (
									<TextInput
										className={cn(
											'rounded-xl border bg-input px-4 py-3.5 text-foreground text-sm dark:bg-input/30',
											errors.password ? 'border-destructive' : 'border-border',
										)}
										placeholder=''
										placeholderTextColor='hsl(var(--muted-foreground))'
										secureTextEntry
										onBlur={onBlur}
										onChangeText={onChange}
										value={value}
									/>
								)}
							/>
							{errors.password && (
								<Text className='text-destructive text-xs'>
									{errors.password.message}
								</Text>
							)}
						</View>

						{/* Confirm Password */}
						<View className='gap-1.5'>
							<Text className='font-medium text-foreground text-sm'>
								Confirm password
							</Text>
							<Controller
								control={control}
								name='confirmPassword'
								render={({ field: { onChange, onBlur, value } }) => (
									<TextInput
										className={cn(
											'rounded-xl border bg-input px-4 py-3.5 text-foreground text-sm dark:bg-input/30',
											errors.confirmPassword ? 'border-destructive' : 'border-border',
										)}
										placeholder=''
										placeholderTextColor='hsl(var(--muted-foreground))'
										secureTextEntry
										onBlur={onBlur}
										onChangeText={onChange}
										value={value}
									/>
								)}
							/>
							{errors.confirmPassword && (
								<Text className='text-destructive text-xs'>
									{errors.confirmPassword.message}
								</Text>
							)}
						</View>

						{/* Terms */}
						<Text className='-mt-1 text-muted-foreground text-xs leading-5'>
							By creating an account you agree to our{' '}
							<Text className='font-medium text-primary'>Terms of Service</Text> and{' '}
							<Text className='font-medium text-primary'>Privacy Policy</Text>.
						</Text>

						{/* Submit */}
						<Pressable
							className='mt-1 items-center rounded-xl bg-primary py-4 active:opacity-80'
							onPress={handleSubmit(onSubmit)}
						>
							<Text className='font-semibold text-base text-primary-foreground'>
								Create account
							</Text>
						</Pressable>
					</View>

					{/* Footer */}
					<View className='mt-5 flex-row items-center justify-center pb-10'>
						<Text className='text-muted-foreground text-sm'>
							Already have an account?{' '}
						</Text>
						<Pressable
							className='active:opacity-70'
							onPress={() => router.replace('/sign-in')}
						>
							<Text className='font-semibold text-primary text-sm'>Sign in</Text>
						</Pressable>
					</View>
				</View>
			</KeyboardAwareScrollView>
		</ThemedView>
	)
}
