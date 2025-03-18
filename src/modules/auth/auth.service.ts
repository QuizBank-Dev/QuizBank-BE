import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { AuthTokenService } from './auth-token/auth-token.service';
import { TokenType } from './auth-token/auth-token.types';
import { AuthTokenPayloadDto } from './auth-token/dto/auth-token-payload.dto';
import { AUTH_COOKIE_KEY, AUTH_COOKIE_OPTIONS } from './auth.const';
import { AuthToken } from './auth.types';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly authTokenService: AuthTokenService,
	) {}

	/**
	 * 회원가입
	 * @param createUserDto 이메일, 비밀번호, 닉네임
	 */
	async register(createUserDto: CreateUserDto) {
		const user = await this.userService.create(createUserDto);
		return this.generateToken({ userId: user._id });
	}

	async validateUser(email: string, password: string) {
		const user = await this.userService.findOne({ email }, { password: 1 });
		return !!user && (await bcrypt.compare(password, user.password))
			? user
			: null;
	}

	async withdraw(id: string) {
		await this.userService.delete(id);
	}

	generateToken(payload: AuthTokenPayloadDto) {
		return {
			accessToken:
				this.authTokenService.generateToken<AuthTokenPayloadDto>(
					TokenType.ACCESS,
					payload,
				),
			refreshToken:
				this.authTokenService.generateToken<AuthTokenPayloadDto>(
					TokenType.REFRESH,
					payload,
				),
		};
	}

	setAuthCookies(
		{ accessToken, refreshToken }: AuthToken,
		response: Response,
	) {
		response.cookie(
			AUTH_COOKIE_KEY.ACCESS,
			accessToken,
			AUTH_COOKIE_OPTIONS.ACCESS,
		);
		response.cookie(
			AUTH_COOKIE_KEY.REFRESH,
			refreshToken,
			AUTH_COOKIE_OPTIONS.REFRESH,
		);
	}

	clearAuthCookies(response: Response) {
		response.clearCookie(AUTH_COOKIE_KEY.ACCESS);
		response.clearCookie(AUTH_COOKIE_KEY.REFRESH);
	}
}
