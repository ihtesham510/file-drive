import {
	CreateBucketCommand,
	HeadBucketCommand,
	PutBucketPolicyCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3'
import { env } from '@file-drive/env/s3'

export const getS3Client = () =>
	new S3Client({
		region: env.REGION,
		endpoint: env.S3URL,
		credentials: {
			accessKeyId: env.ACCESSKEY_ID,
			secretAccessKey: env.SECRET_ACCESS_KEY,
		},
		forcePathStyle: true,
	})

export async function bucketExists(client: S3Client, bucket: string) {
	try {
		await client.send(new HeadBucketCommand({ Bucket: bucket }))
		return true
	} catch {
		return false
	}
}

export async function ensureBucket(
	client: S3Client,
	bucket: string,
	onCreate?: () => void,
) {
	const exists = await bucketExists(client, bucket)
	if (!exists) {
		await client.send(new CreateBucketCommand({ Bucket: bucket }))
		await setPublic(client, bucket)
		onCreate?.()
	}
}
export async function setPublic(client: S3Client, bucket: string) {
	await client.send(
		new PutBucketPolicyCommand({
			Bucket: bucket,
			Policy: JSON.stringify({
				Version: '2012-10-17',
				Statement: [
					{
						Effect: 'Allow',
						Principal: '*',
						Action: 's3:GetObject',
						Resource: 'arn:aws:s3:::file-drive/*',
					},
				],
			}),
		}),
	)
}

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
	await ensureBucket(client, bucket)
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
