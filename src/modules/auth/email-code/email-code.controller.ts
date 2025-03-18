import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GenerateEmailVerificationCodeDto } from './dto/generate-email-verification-code.dto';
import { EmailVerificationDto } from './dto/email-verification.dto';
import { EmailCodeService } from './email-code.service';
import { Public } from '../decorator/public.decorator';

@Controller('auth/verification')
export class EmailCodeController {
	constructor(private readonly emailCodeService: EmailCodeService) {}

	@Public()
	@Post()
	@HttpCode(200)
	@ApiOperation({
		summary: '이메일 인증',
		description: '발급된 코드를 사용해 이메일을 인증합니다.',
	})
	@ApiResponse({ status: 200, description: '인증이 완료되었습니다.' })
	@ApiResponse({ status: 401, description: '인증코드가 유효하지 않습니다.' })
	@ApiResponse({ status: 409, description: '이미 가입된 이메일입니다.' })
	async verification(@Body() verificationCodeDto: EmailVerificationDto) {
		await this.emailCodeService.verification(verificationCodeDto);
		return;
	}

	@Public()
	@Post('code')
	@HttpCode(200)
	@ApiOperation({
		summary: '인증코드 발급',
		description: '이메일을 인증을 위한 코드를 발급합니다.',
	})
	@ApiResponse({ status: 200, description: '코드 발급이 완료되었습니다.' })
	@ApiResponse({ status: 400, description: '이메일 전송에 실패했습니다.' })
	async generateCode(
		@Body() generateCodeDto: GenerateEmailVerificationCodeDto,
	) {
		await this.emailCodeService.generateCode(generateCodeDto);
		return;
	}
}
