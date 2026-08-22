import { resolve } from 'node:path'
import { createEnv } from '@t3-oss/env-core'
import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config({ path: resolve(process.cwd(), '../../.env') })

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
		CORS_ORIGIN: z.url(),
		// s3
		S3URL: z.string().min(1),
		ACCESSKEY_ID: z.string().min(1),
		SECRET_ACCESS_KEY: z.string().min(1),
		BUCKET_NAME: z.string().min(1),
		// node environment
		NODE_ENV: z
			.enum(['development', 'production', 'test'])
			.default('development'),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
})
