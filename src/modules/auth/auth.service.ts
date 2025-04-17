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
import { OAuthLoginDto } from '../user/dto/oauth-login.dto';
import { FollowService } from '../follow/follow.service';
import { GroupService } from '../group/group.service';
import { UserService } from '../user/user.service';
import { FollowType } from '../follow/dto/follow-query.dto';
import { Types } from 'mongoose';
import { StudyLogService } from '../study-log/study-log.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly configService: ConfigService,
		private readonly authTokenService: AuthTokenService,
		private readonly userRepository: UserRepository,
		private readonly studyLogService: StudyLogService,
		private readonly userService: UserService,
		private readonly followService: FollowService,
		private readonly groupService: GroupService,
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
	 * OAuth 로그인(회원가입)
	 * @param id OAuth 고유 id
	 * @param nickname 닉네임
	 * @param profileImg 프로필사진
	 * @param provider OAuth Provider
	 */
	async oauthLogin({ id, nickname, profileImg, provider }: OAuthLoginDto) {
		const user = await this.userRepository.findOne({
			email: id,
			oAuth: provider,
		});

		// 가입된 정보가 없는 경우 회원 등록
		if (!user) {
			const newUser = await this.userRepository.createOAuth({
				id,
				nickname,
				profileImg,
				provider,
			});
			return this.generateToken({ userId: newUser._id });
		}

		return this.generateToken({ userId: user._id });
	}

	/**
	 * 회원 탈퇴
	 * @param id 해당 사용자의 아이디
	 */
	async withdraw(id: string) {
		// 1. 팔로워 / 팔로잉 삭제
		const { follower, following } = await this.followService.getAllFollower(
			id,
			FollowType.ALL,
		);
		await Promise.all([
			...follower!.map(async ({ _id }) =>
				this.followService.removeFollow(
					id,
					(_id as Types.ObjectId).toString(),
					FollowType.FOLLOWER,
				),
			),
			...following!.map(async ({ _id }) =>
				this.followService.removeFollow(
					id,
					(_id as Types.ObjectId).toString(),
					FollowType.FOLLOWING,
				),
			),
		]);

		// 2. 닉네임, 프로필사진 수정
		await this.userService.updateProfile(id, {
			nickname: '탈퇴한사용자',
		});
		await this.userService.deleteProfileImg(id);

		// 3. 그룹 탈퇴
		const groups = (
			await this.groupService.getGroupList(id, {
				limit: Number.MAX_VALUE,
				is_mine: true,
			})
		).list;
		await Promise.all(
			groups.map(async ({ _id }) =>
				this.groupService.deleteGroupWithdraw(id, _id as string),
			),
		);

		// 4. 학습 기록 제거
		await this.studyLogService.deleteStudyLog(id);

		// 5. 최종적으로 탈퇴 처리
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
