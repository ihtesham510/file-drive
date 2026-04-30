import 'dotenv/config'
import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
		CORS_ORIGIN: z.url(),
		// s3
		REGION: z.string().min(1).default('us-east-1'),
		S3URL: z.string().min(1),
		ACCESSKEY_ID: z.string().min(1),
		SECRET_ACCESS_KEY: z.string().min(1),
		// node environment
		NODE_ENV: z
			.enum(['development', 'production', 'test'])
			.default('development'),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
})
