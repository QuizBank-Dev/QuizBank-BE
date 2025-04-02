import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { TokenOption, TokenType } from './auth-token.types';
import { TOKEN_OPTIONS } from './auth-token.providers';

@Injectable()
export class AuthTokenService {
	constructor(
		private readonly jwtService: JwtService,
		@Inject(TOKEN_OPTIONS)
		private readonly tokenOptions: Record<TokenType, TokenOption>,
		@Inject(CACHE_MANAGER)
		private readonly cacheManager: Cache,
	) {}

	/**
	 * 토큰 검증
	 * @param type 토큰 타입 (ACCESS | REFRESH | INVITE)
	 * @param token 토큰
	 */
	verifyToken<T extends object>(type: TokenType, token: string) {
		return this.jwtService.verify<T>(token, {
			secret: this.tokenOptions[type].secret,
		});
	}

	/**
	 * 토큰 생성
	 * @param type 토큰 타입 (ACCESS | REFRESH | INVITE)
	 * @param payload 토큰 payload
	 */
	generateToken<T extends object>(type: TokenType, payload: T) {
		const { secret, expiry } = this.tokenOptions[type];

		return this.jwtService.sign(payload, {
			secret,
			expiresIn: expiry,
		});
	}

	/**
	 * 토큰 만료
	 * @param token 만료할 토큰
	 */
	async expireToken(token: string) {
		const exp = this.jwtService.decode<{ exp: number }>(token).exp;
		await this.cacheManager.set(
			`blacklist:${token}`,
			true,
			new Date(exp * 1000).getTime() - Date.now(),
		);
	}

	/**
	 * 만료된 토큰인지 확인
	 * @param token 토큰
	 */
	async isExpiredToken(token: string) {
		return !!(await this.cacheManager.get(`blacklist:${token}`));
	}
}
