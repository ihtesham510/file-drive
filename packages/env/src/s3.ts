import 'dotenv/config'
import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
	server: {
		REGION: z.string().min(1).default('us-east-1'),
		S3URL: z.string().min(1),
		ACCESSKEY_ID: z.string().min(1),
		SECRET_ACCESS_KEY: z.string().min(1),
		NODE_ENV: z
			.enum(['development', 'production', 'test'])
			.default('development'),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
})
