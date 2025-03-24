import { Response, Request } from 'express';
import {
	Body,
	Controller,
	Delete,
	HttpCode,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './decorator/public.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { UserId } from '../../common/decorators/user-id.decorator';
import { AuthToken } from './auth.types';
import { BaseResponse } from '../../common/dto/base-response.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('signup')
	@ApiOperation({
		summary: '회원가입',
		description: '회원가입을 진행합니다.',
	})
	@ApiResponse({
		status: 201,
		description: '회원가입 완료',
		type: BaseResponse<undefined>,
	})
	async signup(
		@Res({ passthrough: true }) response: Response,
		@Body() signupDto: CreateUserDto,
	) {
		const result = await this.authService.register(signupDto);
		this.authService.setAuthCookies(result, response);
	}

	@Public()
	@Post('login')
	@HttpCode(200)
	@UseGuards(AuthGuard('local'))
	@ApiOperation({
		summary: '로그인',
		description: '로그인을 진행합니다.',
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				email: { type: 'string', example: 'example@example.com' },
				password: { type: 'string', example: 'password12' },
			},
			required: ['email', 'password'],
		},
	})
	@ApiResponse({
		status: 200,
		description: '로그인 완료',
		type: BaseResponse<undefined>,
	})
	login(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	) {
		const result = request.user! as unknown as AuthToken;
		this.authService.setAuthCookies(result, response);
	}

	@Post('logout')
	@HttpCode(200)
	@ApiOperation({
		summary: '로그아웃',
		description: '로그아웃입니다.',
	})
	@ApiResponse({
		status: 200,
		description: '로그아웃 완료',
		type: BaseResponse<undefined>,
	})
	async logout(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	) {
		await this.authService.clearAuthCookies(response, request.cookies);
	}

	@Delete('withdraw')
	@ApiOperation({
		summary: '회원탈퇴',
	})
	@ApiResponse({
		status: 200,
		description: '탈퇴 완료',
		type: BaseResponse<undefined>,
	})
	async withdraw(
		@UserId() userId: string,
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	) {
		await this.authService.withdraw(userId);
		await this.authService.clearAuthCookies(response, request.cookies);
	}
}
