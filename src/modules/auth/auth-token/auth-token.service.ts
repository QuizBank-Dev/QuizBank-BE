import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenOption, TokenType } from './auth-token.types';
import { TOKEN_OPTIONS } from './auth-token.providers';

@Injectable()
export class AuthTokenService {
	constructor(
		private readonly jwtService: JwtService,
		@Inject(TOKEN_OPTIONS)
		private readonly tokenOptions: Record<TokenType, TokenOption>,
	) {}

	/**
	 * 토큰 검증
	 * @param type 토큰 타입 (ACCESS | REFRESH)
	 * @param token 토큰
	 */
	verifyToken<T extends object>(type: TokenType, token: string) {
		return this.jwtService.verify<T>(token, {
			secret: this.tokenOptions[type].secret,
		});
	}

	/**
	 * 토큰 생성
	 * @param type 토큰 타입 (ACCESS | REFRESH)
	 * @param payload 토큰 payload
	 */
	generateToken<T extends object>(type: TokenType, payload: T) {
		const { secret, expiry } = this.tokenOptions[type];

		return this.jwtService.sign(payload, {
			secret,
			expiresIn: expiry,
		});
	}
}
