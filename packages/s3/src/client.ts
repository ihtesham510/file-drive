import { S3Client } from '@aws-sdk/client-s3'
import { env } from '@file-drive/env/s3'

export const s3Client = new S3Client({
	region: env.REGION,
	endpoint: env.S3URL,
	credentials: {
		accessKeyId: env.ACCESSKEY_ID,
		secretAccessKey: env.SECRET_ACCESS_KEY,
	},
	forcePathStyle: true,
})
