import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadProviders } from './upload.providers';

@Module({
	providers: [UploadService, ...UploadProviders],
	exports: [UploadService],
})
export class UploadModule {}
