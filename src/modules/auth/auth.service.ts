import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthTokenService } from './auth-token/auth-token.service';
import { UserRepository } from '../user/user.repository';
import { TokenType } from './auth-token/auth-token.types';
import { AuthTokenPayloadDto } from './auth-token/dto/auth-token-payload.dto';
import { AUTH_COOKIE_KEY, AUTH_COOKIE_OPTIONS } from './auth.const';
import { AuthToken } from './auth.types';
import { ConfigService } from '@nestjs/config';
import { envKeys } from '../../config/env.const';

@Injectable()
export class AuthService {
	constructor(
		private readonly configService: ConfigService,
		private readonly authTokenService: AuthTokenService,
		private readonly userRepository: UserRepository,
	) {}

	/**
	 * 회원가입
	 * @param createUserDto 이메일, 비밀번호, 닉네임
	 */
	async register(createUserDto: CreateUserDto) {
		const alreadySignedUp = await this.userRepository.findOne({
			email: createUserDto.email,
		});

		if (alreadySignedUp) {
			throw new ConflictException('이미 가입된 이메일입니다.');
		}

		const hashedPassword: string = await bcrypt.hash(
			createUserDto.password,
			this.configService.get<number>(envKeys.SECURITY.HASH_ROUNDS)!,
		);
		const user = await this.userRepository.create({
			...createUserDto,
			password: hashedPassword,
		});

		return this.generateToken({ userId: user._id });
	}

	/**
	 * 로그인하는 사용자 검증
	 * @param email 이메일
	 * @param password 비밀번호
	 */
	async validateUser(email: string, password: string) {
		const user = await this.userRepository.findOne(
			{ email },
			{ password: 1 },
		);

		return !!user && (await bcrypt.compare(password, user.password))
			? user
			: null;
	}

	/**
	 * 회원 탈퇴
	 * @param id 해당 사용자의 아이디
	 */
	async withdraw(id: string) {
		await this.userRepository.delete(id);
	}

	/**
	 * 인증 토큰(accessToken, refreshToken) 생성
	 * @param payload \{ userId: User._id \}
	 */
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

	/**
	 * 인증 토큰을 cookie에 설정
	 * @param authToken generateToken을 통해 생성된 토큰
	 * @param response
	 */
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

	/**
	 * 인증토큰을 제거
	 * @param response
	 * @param cookies
	 */
	async clearAuthCookies(
		response: Response,
		cookies: Record<
			(typeof AUTH_COOKIE_KEY)[keyof typeof AUTH_COOKIE_KEY],
			string
		>,
	) {
		const { access_token, refresh_token } = cookies;

		// 토큰 만료
		await this.authTokenService.expireToken(access_token);
		await this.authTokenService.expireToken(refresh_token);

		response.clearCookie(AUTH_COOKIE_KEY.ACCESS);
		response.clearCookie(AUTH_COOKIE_KEY.REFRESH);
	}
}
