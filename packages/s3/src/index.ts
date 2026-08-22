import crypto from 'node:crypto'
import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '@file-drive/env/server'

const s3 = new S3Client({
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

export function getUploadUrl(
	filename: string,
	userId: string,
	contentType: string,
) {
	const key = `${crypto.randomUUID()}-${userId}-${filename}`
	const command = new PutObjectCommand({
		Bucket: env.BUCKET_NAME,
		Key: key,
		ContentType: contentType,
	})
	return getSignedUrl(s3, command, { expiresIn: 3600 })
}

export async function getFileUrl(key: string): Promise<string | null> {
	const command = new GetObjectCommand({
		Key: key,
		Bucket: env.BUCKET_NAME,
	})
	try {
		return await getSignedUrl(s3, command, { expiresIn: 3600 })
	} catch (_err) {
		console.error(_err)
		return null
	}
}
