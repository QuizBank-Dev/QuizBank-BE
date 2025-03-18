import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { AuthTokenService } from './auth-token/auth-token.service';
import { TokenType } from './auth-token/auth-token.types';
import { AuthTokenPayloadDto } from './auth-token/dto/auth-token-payload.dto';

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
}
