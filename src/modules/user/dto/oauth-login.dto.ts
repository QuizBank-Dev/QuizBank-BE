import { ProviderType } from '../schema/user.schema';

export class OAuthLoginDto {
	id: string;
	nickname: string;
	profileImg: string;
	provider: ProviderType;
}
