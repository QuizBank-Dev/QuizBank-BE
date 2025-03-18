import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_TYPE } from '../../../database/database.const';
import { EmailCode, EmailCodeSchema } from './schema/email-code.schema';
import { MailerModule } from '../../mailer/mailer.module';
import { EmailCodeController } from './email-code.controller';
import { EmailCodeService } from './email-code.service';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: EmailCode.name, schema: EmailCodeSchema }],
			DB_TYPE.DEFAULT,
		),
		MailerModule,
	],
	providers: [EmailCodeService],
	controllers: [EmailCodeController],
})
export class EmailCodeModule {}
