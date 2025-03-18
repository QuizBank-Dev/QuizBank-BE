import { Response, Request } from 'express';
import {
	Body,
	Controller,
	Delete,
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
import { UserId } from '../../common/decorators/user-id.decorator';
import { AuthToken } from './auth.types';

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
		this.authService.setAuthCookies(result, response);
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
		const result = request.user! as unknown as AuthToken;
		this.authService.setAuthCookies(result, response);
	}

	@Post('logout')
	@ApiOperation({
		summary: '로그아웃',
		description: '로그아웃입니다.',
	})
	logout(@Res({ passthrough: true }) response: Response) {
		this.authService.clearAuthCookies(response);
	}

	@Delete('withdraw')
	@ApiOperation({
		summary: '회원탈퇴',
	})
	async withdraw(
		@UserId() userId: string,
		@Res({ passthrough: true }) response: Response,
	) {
		await this.authService.withdraw(userId);
		// TODO 회원 탈퇴 시 함께 제거되어야 할 데이터 어떻게할지 논의
		// TODO 토큰 만료 방식 논의
		this.authService.clearAuthCookies(response);
	}
}
