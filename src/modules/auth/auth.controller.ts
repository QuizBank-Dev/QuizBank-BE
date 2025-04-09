import { Response, Request } from 'express';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBody,
	ApiExcludeEndpoint,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './decorator/public.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { UserId } from '../../common/decorators/user-id.decorator';
import { AuthToken } from './auth.types';
import { DynamicAuthGuard } from './guard/dynamic-auth.guard';
import { OAuthLoginDto } from '../user/dto/oauth-login.dto';
import { ProviderType } from '../user/schema/user.schema';
import { ApiBaseResponse } from '../../common/decorators/base-response.decorator';

@Controller({ path: 'auth', version: '1' })
@ApiTags('Auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('signup')
	@ApiOperation({
		summary: '회원가입',
		description: '회원가입을 진행합니다.',
	})
	@ApiBaseResponse(201, '회원가입 완료')
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
	@ApiBaseResponse(200, '로그인 완료')
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
	@ApiBaseResponse(200, '로그아웃 완료')
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
	@ApiBaseResponse(200, '탈퇴 완료')
	async withdraw(
		@UserId() userId: string,
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	) {
		await this.authService.withdraw(userId);
		await this.authService.clearAuthCookies(response, request.cookies);
	}

	@Public()
	@Get('oauth/:provider')
	@UseGuards(DynamicAuthGuard())
	@ApiOperation({
		summary: 'OAuth 로그인',
		description:
			'OAuth 로그인을 진행합니다. (Swagger로 테스트 불가능, 브라우저에 url 직접 입력) ',
	})
	@ApiParam({
		name: 'provider',
		enum: ProviderType,
		description: 'OAuth provider',
	})
	@ApiBaseResponse(200, '로그인 완료')
	checkOAuthProvider() {}

	@Public()
	@Get('oauth/:provider/callback')
	@UseGuards(DynamicAuthGuard())
	@ApiOperation({ summary: 'OAuth 콜백' })
	@ApiExcludeEndpoint()
	async oauthCallback(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	) {
		const result = await this.authService.oauthLogin(
			request.user as unknown as OAuthLoginDto,
		);

		this.authService.setAuthCookies(result, response);
	}
}
