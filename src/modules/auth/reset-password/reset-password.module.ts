import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResetPasswordController } from './reset-password.controller';
import { ResetPasswordService } from './reset-password.service';
import { UserModule } from '../../user/user.module';
import { MailerModule } from '../../mailer/mailer.module';
import { AuthTokenModule } from '../auth-token/auth-token.module';
import { DB_TYPE } from '../../../database/database.const';
import {
	ResetPassword,
	ResetPasswordSchema,
} from './schema/reset-password.schema';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: ResetPassword.name, schema: ResetPasswordSchema }],
			DB_TYPE.DEFAULT,
		),
		UserModule,
		MailerModule,
		AuthTokenModule,
	],
	controllers: [ResetPasswordController],
	providers: [ResetPasswordService],
})
export class ResetPasswordModule {}
