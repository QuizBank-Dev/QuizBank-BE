import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { envKeys } from 'src/config/env.const';
import { OAuthLoginDto } from '../../user/dto/oauth-login.dto';
import { ProviderType } from '../../user/schema/user.schema';

@Injectable()
export class GitHubStrategy extends PassportStrategy(
	Strategy,
	ProviderType.GITHUB,
) {
	constructor(readonly configService: ConfigService) {
		super({
			clientID: configService.get<string>(envKeys.OAUTH.GITHUB.ID)!,
			clientSecret: configService.get<string>(
				envKeys.OAUTH.GITHUB.SECRET,
			)!,
			callbackURL: `/v1/auth/oauth/github/callback`,
		});
	}

	validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
	): OAuthLoginDto {
		const profileImg = profile.photos?.[0]?.value || profile.profileUrl;
		const nickname = profile.displayName || profile.username!;
		return {
			id: profile.id,
			nickname,
			profileImg,
			provider: ProviderType.GITHUB,
		};
	}
}
