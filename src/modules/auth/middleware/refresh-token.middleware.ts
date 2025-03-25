import { NextFunction, Request, Response } from 'express';
import {
	Injectable,
	InternalServerErrorException,
	NestMiddleware,
	UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';
import { AuthTokenService } from '../auth-token/auth-token.service';
import { TokenType } from '../auth-token/auth-token.types';
import { AuthTokenPayloadDto } from '../auth-token/dto/auth-token-payload.dto';
import { AUTH_COOKIE_KEY, AUTH_COOKIE_OPTIONS } from '../auth.const';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
	constructor(private tokenService: AuthTokenService) {}

	async use(request: Request, response: Response, next: NextFunction) {
		const accessToken = request.cookies[AUTH_COOKIE_KEY.ACCESS] as
			| string
			| undefined;
		const refreshToken = request.cookies[AUTH_COOKIE_KEY.REFRESH] as
			| string
			| undefined;

		// 토큰이 존재하지 않은 경우 그냥 넘어감
		if (!accessToken && !refreshToken) {
			return next();
		}

		// blacklist에 등록된 토큰인 경우 오류 발생
		if (
			(await this.tokenService.isExpiredToken(accessToken || '')) ||
			(await this.tokenService.isExpiredToken(refreshToken || ''))
		) {
			throw new UnauthorizedException('인증정보가 올바르지 않습니다.');
		}

		try {
			// 1. AccessToken 검증
			const decoded = this.tokenService.verifyToken<AuthTokenPayloadDto>(
				TokenType.ACCESS,
				accessToken || '',
			);
			if (decoded) {
				request.user = decoded;
				return next();
			}
		} catch (error) {
			try {
				// 2. RefreshToken 검증
				const decoded =
					this.tokenService.verifyToken<AuthTokenPayloadDto>(
						TokenType.REFRESH,
						refreshToken || '',
					);

				if (decoded) {
					// 3. AccessToken 재발급
					const newToken =
						this.tokenService.generateToken<AuthTokenPayloadDto>(
							TokenType.ACCESS,
							{ userId: decoded.userId },
						);

					response.cookie(
						AUTH_COOKIE_KEY.ACCESS,
						newToken,
						AUTH_COOKIE_OPTIONS.ACCESS,
					);

					request.user = decoded;

					return next();
				}
			} catch (error) {
				if (error instanceof JsonWebTokenError) {
					throw new UnauthorizedException(
						'인증정보가 올바르지 않습니다.',
					);
				}

				throw new InternalServerErrorException(
					'알 수 없는 오류가 발생했습니다.',
				);
			}

			throw new InternalServerErrorException(
				'알 수 없는 오류가 발생했습니다.',
			);
		}
	}
}
