import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	@ApiOperation({
		summary: '회원가입',
		description: '회원가입을 진행합니다.',
	})
	@ApiResponse({ status: 201, description: '회원가입이 완료되었습니다.' })
	@ApiResponse({ status: 400, description: '회원가입을 실패했습니다.' })
	async signup(@Body() signupDto: CreateUserDto) {
		await this.authService.register(signupDto);
		// TODO 인증토큰 발급 로직
	}
}
