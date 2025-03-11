import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Options } from 'nodemailer/lib/smtp-transport';
import { envKeys } from '../../config/env.const';

export const MAILER_TRANSPORT = 'MAILER_TRANSPORT';

export const MailerProviders: Provider[] = [
	{
		provide: MAILER_TRANSPORT,
		useFactory: (configService: ConfigService): Options => ({
			host: configService.get<string>(envKeys.MAILER.HOST)!,
			port: configService.get<number>(envKeys.MAILER.PORT)!,
			secure: true,
			auth: {
				user: configService.get<string>(envKeys.MAILER.USER)!,
				pass: configService.get<string>(envKeys.MAILER.PASS)!,
			},
			tls: {
				rejectUnauthorized: false,
			},
		}),
		inject: [ConfigService],
	},
];
