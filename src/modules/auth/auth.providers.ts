import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { envKeys } from '../../config/env.const';

export const COOKIE_OPTIONS = 'COOKIE_OPTIONS';

export const AuthProviders: Provider[] = [
	{
		provide: COOKIE_OPTIONS,
		useFactory: (configService: ConfigService) => {
			const env = configService.get<'dev' | 'prod'>(envKeys.ENV)!;
			const hostname = new URL(
				env === 'prod'
					? configService.get(envKeys.CLIENT.PROD)!
					: configService.get(envKeys.CLIENT.LOCAL)!,
			).hostname;

			return {
				domain: hostname,
				sameSite: env === 'prod' ? 'none' : 'lax',
				secure: env === 'prod',
			};
		},
		inject: [ConfigService],
	},
];
