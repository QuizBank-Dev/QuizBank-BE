import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { envKeys } from '../../../config/env.const';
import { AUTH_TOKEN_EXPIRY } from '../auth.const';

export const TOKEN_OPTIONS = 'TOKEN_OPTIONS';

export const AuthTokenProviders: Provider[] = [
	{
		provide: TOKEN_OPTIONS,
		useFactory: (configService: ConfigService) => ({
			access: {
				expiry: AUTH_TOKEN_EXPIRY.ACCESS,
				secret: configService.get<string>(
					envKeys.SECURITY.ACCESS_TOKEN_SECRET,
				)!,
			},
			refresh: {
				expiry: AUTH_TOKEN_EXPIRY.REFRESH,
				secret: configService.get<string>(
					envKeys.SECURITY.REFRESH_TOKEN_SECRET,
				)!,
			},
			invite: {
				expiry: AUTH_TOKEN_EXPIRY.INVITE,
				secret: configService.get<string>(
					envKeys.SECURITY.INVITE_TOKEN_SECRET,
				)!,
			},
			reset_password: {
				expiry: AUTH_TOKEN_EXPIRY.RESET_PASSWORD,
				secret: configService.get<string>(
					envKeys.SECURITY.RESET_PASSWORD_TOKEN_SECRET,
				)!,
			},
		}),
		inject: [ConfigService],
	},
];
