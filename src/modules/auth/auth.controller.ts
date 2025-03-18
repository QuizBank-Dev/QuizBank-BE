import { Response, Request } from 'express';
import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
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
		const { accessToken, refreshToken } =
			await this.authService.register(signupDto);

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

	@Public()
	@Post('login')
	@UseGuards(AuthGuard('local'))
	@ApiOperation({
		summary: '로그인',
		description: '로그인을 진행합니다.',
	})
	login(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	) {
		const { accessToken, refreshToken } = request.user! as unknown as {
			accessToken: string;
			refreshToken: string;
		};

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
