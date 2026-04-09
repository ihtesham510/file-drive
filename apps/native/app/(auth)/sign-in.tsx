import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, Text, TextInput, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import z from 'zod'
import { GoogleSignIn } from '@/components/auth/google-sign-in'
import { ThemedText } from '@/components/common/themed-text'
import { ThemedView } from '@/components/common/themed-view'

const schema = z.object({
	email: z.email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormData = z.infer<typeof schema>

export default function Page() {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	})

	const onSubmit = (data: FormData) => {
		console.log('Sign in:', data)
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
						<ThemedText className='mb-1 font-bold text-3xl text-foreground tracking-tight'>Welcome back</ThemedText>
						<ThemedText className='text-muted-foreground text-sm'>Sign in to your account</ThemedText>
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
						{/* Email */}
						<View className='gap-1.5'>
							<Text className='font-medium text-foreground text-sm'>Email</Text>
							<Controller
								control={control}
								name='email'
								render={({ field: { onChange, onBlur, value } }) => (
									<TextInput
										className={`rounded-xl border bg-input px-4 py-3.5 text-foreground text-sm ${
											errors.email ? 'border-destructive' : 'border-border'
										}`}
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
							{errors.email && <Text className='text-destructive text-xs'>{errors.email.message}</Text>}
						</View>

						{/* Password */}
						<View className='gap-1.5'>
							<View className='flex-row items-center justify-between'>
								<Text className='font-medium text-foreground text-sm'>Password</Text>
								<Pressable className='active:opacity-70'>
									<Text className='font-medium text-primary text-sm'>Forgot password?</Text>
								</Pressable>
							</View>
							<Controller
								control={control}
								name='password'
								render={({ field: { onChange, onBlur, value } }) => (
									<TextInput
										className={`rounded-xl border bg-input px-4 py-3.5 text-foreground text-sm dark:bg-input/30 ${
											errors.password ? 'border-destructive' : 'border-border'
										}`}
										placeholder='••••••••'
										placeholderTextColor='hsl(var(--muted-foreground))'
										secureTextEntry
										onBlur={onBlur}
										onChangeText={onChange}
										value={value}
									/>
								)}
							/>
							{errors.password && <Text className='text-destructive text-xs'>{errors.password.message}</Text>}
						</View>

						{/* Submit */}
						<Pressable className='mt-1 items-center rounded-xl bg-primary py-4 active:opacity-80' onPress={handleSubmit(onSubmit)}>
							<Text className='font-semibold text-base text-primary-foreground'>Sign in</Text>
						</Pressable>
					</View>

					{/* Footer */}
					<View className='mt-8 flex-row items-center justify-center pb-10'>
						<Text className='text-muted-foreground text-sm'>Don't have an account? </Text>
						<Pressable className='active:opacity-70' onPress={() => router.replace('/sign-up')}>
							<Text className='font-semibold text-primary text-sm'>Sign up</Text>
						</Pressable>
					</View>
				</View>
			</KeyboardAwareScrollView>
		</ThemedView>
	)
}
