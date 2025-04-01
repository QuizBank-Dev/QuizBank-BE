import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { envKeys } from '../../config/env.const';

export const CLOUDFLARE_CONST = 'CLOUDFLARE_CONST';

export const UploadProviders: Provider[] = [
	{
		provide: CLOUDFLARE_CONST,
		useFactory: (configService: ConfigService) => ({
			region: configService.get<string>(envKeys.CLOUDFLARE.REGION)!,
			endpoint: configService.get<string>(envKeys.CLOUDFLARE.ENDPOINT)!,
			bucket: configService.get<string>(envKeys.CLOUDFLARE.BUCKET)!,
			accessKey: configService.get<string>(
				envKeys.CLOUDFLARE.ACCESS_KEY,
			)!,
			secretKey: configService.get<string>(
				envKeys.CLOUDFLARE.SECRET_KEY,
			)!,
			publicUrl: configService.get<string>(
				envKeys.CLOUDFLARE.PUBLIC_URL,
			)!,
		}),
		inject: [ConfigService],
	},
];
