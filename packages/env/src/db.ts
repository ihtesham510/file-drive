import { resolve } from 'node:path'
import { createEnv } from '@t3-oss/env-core'
import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config({ path: resolve(process.cwd(), '../../.env') })

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
})
