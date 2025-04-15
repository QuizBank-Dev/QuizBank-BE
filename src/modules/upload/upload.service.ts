import { Inject, Injectable } from '@nestjs/common';
import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { CLOUDFLARE_CONST } from './upload.providers';

@Injectable()
export class UploadService {
	private client: S3Client;

	constructor(
		@Inject(CLOUDFLARE_CONST)
		private readonly r2Const: Record<string, string>,
	) {
		this.client = new S3Client({
			region: this.r2Const.region,
			endpoint: this.r2Const.endpoint,
			credentials: {
				accessKeyId: this.r2Const.accessKey,
				secretAccessKey: this.r2Const.secretKey,
			},
		});
	}

	/**
	 * 파일 업로드
	 * @param file 업로드할 파일
	 */
	async upload(file: Express.Multer.File) {
		const fileName = uuid();
		await this.client.send(
			new PutObjectCommand({
				Bucket: this.r2Const.bucket,
				Key: fileName,
				Body: file.buffer,
				ContentType: file.mimetype,
			}),
		);
		return `${this.r2Const.publicUrl}/${fileName}`;
	}

	/**
	 * 파일 삭제
	 * @param fileUrl 삭제할 파일의 url(DB에 저장되어있는 형식)
	 */
	async delete(fileUrl: string) {
		const fileName = fileUrl.split(`${this.r2Const.publicUrl}/`)[1];

		if (!fileName) {
			return;
		}

		await this.client.send(
			new DeleteObjectCommand({
				Bucket: this.r2Const.bucket,
				Key: fileName,
			}),
		);
	}
}
