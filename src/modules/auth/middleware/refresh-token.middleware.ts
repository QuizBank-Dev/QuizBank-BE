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

	use(request: Request, response: Response, next: NextFunction) {
		const accessToken = request.cookies[AUTH_COOKIE_KEY.ACCESS] as
			| string
			| undefined;
		const refreshToken = request.cookies[AUTH_COOKIE_KEY.REFRESH] as
			| string
			| undefined;

		if (!accessToken && !refreshToken) {
			return next();
		}

		try {
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
				const decoded =
					this.tokenService.verifyToken<AuthTokenPayloadDto>(
						TokenType.REFRESH,
						refreshToken || '',
					);

				if (decoded) {
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
