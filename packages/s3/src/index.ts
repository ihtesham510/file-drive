import {
	CreateBucketCommand,
	HeadBucketCommand,
	PutObjectCommand,
	type S3Client,
} from '@aws-sdk/client-s3'

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
	const exists = bucketExists(client, 'file-drive')
	if (!exists) {
		await client.send(new CreateBucketCommand({ Bucket: bucket }))
		onCreate?.()
	}
}

export async function uploadFile(
	userId: string,
	fileName: string,
	file: Buffer | Uint8Array,
	client: S3Client,
	contentType: string,
	bucket?: string,
) {
	const key = `${userId}/${fileName}`

	await client.send(
		new PutObjectCommand({
			Bucket: bucket ?? 'file-drive',
			Key: key,
			Body: file,
			ContentType: contentType,
		}),
	)

	return key
}
