import { Module } from '@nestjs/common';
import { LoggerModule } from '../../common/logger/logger.module';
import { MailerService } from './mailer.service';
import { MailerProviders } from './mailer.providers';

@Module({
	imports: [LoggerModule],
	providers: [MailerService, ...MailerProviders],
	exports: [MailerService],
})
export class MailerModule {}
