import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerProviders } from './mailer.providers';

@Module({
	providers: [MailerService, ...MailerProviders],
	exports: [MailerService],
})
export class MailerModule {}
