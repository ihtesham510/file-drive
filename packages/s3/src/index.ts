import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { env } from '@file-drive/env/server'

export const getS3Client = () =>
	new S3Client({
		region: 'auto',
		endpoint: env.S3URL,
		credentials: {
			accessKeyId: env.ACCESSKEY_ID,
			secretAccessKey: env.SECRET_ACCESS_KEY,
		},
		forcePathStyle: true,
	})

export async function uploadFile({
	userId,
	fileName,
	file,
	client,
	contentType,
	bucket,
}: {
	userId: string
	fileName: string
	file: Buffer | Uint8Array
	client: S3Client
	contentType: string
	bucket: string
}) {
	const key = `${userId}/${fileName}`

	await client.send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Body: file,
			ContentType: contentType,
		}),
	)

	return key
}
