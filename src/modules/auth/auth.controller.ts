import { Response } from 'express';
import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './decorator/public.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AUTH_COOKIE_KEY, AUTH_COOKIE_OPTIONS } from './auth.const';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('signup')
	@ApiOperation({
		summary: '회원가입',
		description: '회원가입을 진행합니다.',
	})
	@ApiResponse({ status: 201, description: '회원가입이 완료되었습니다.' })
	@ApiResponse({ status: 400, description: '회원가입을 실패했습니다.' })
	async signup(
		@Res({ passthrough: true }) response: Response,
		@Body() signupDto: CreateUserDto,
	) {
		const result = await this.authService.register(signupDto);

		response.cookie(
			AUTH_COOKIE_KEY.ACCESS,
			result.accessToken,
			AUTH_COOKIE_OPTIONS.ACCESS,
		);
		response.cookie(
			AUTH_COOKIE_KEY.REFRESH,
			result.refreshToken,
			AUTH_COOKIE_OPTIONS.REFRESH,
		);
	}

	@Post('logout')
	logout(@Res({ passthrough: true }) response: Response) {
		response.clearCookie(AUTH_COOKIE_KEY.ACCESS);
		response.clearCookie(AUTH_COOKIE_KEY.REFRESH);
	}

	@Get()
	test() {
		return 'test';
	}
}
