import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from '../../../common/dto/base-response.dto';
import { Public } from '../decorator/public.decorator';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ConfirmResetPasswordDto } from './dto/confirm-reset-password.dto';
import { ResetPasswordService } from './reset-password.service';

@ApiTags('Auth')
@Controller('auth/reset-password')
export class ResetPasswordController {
	constructor(private readonly resetPasswordService: ResetPasswordService) {}

	@Public()
	@Post('request')
	@ApiOperation({
		summary: '비밀번호 초기화 링크 발급',
		description: '비밀번호 초기화 링크를 발급합니다.',
	})
	@ApiResponse({
		status: 201,
		description: '발급 성공',
		type: BaseResponse<undefined>,
	})
	async request(@Body() requestResetPasswordDto: RequestResetPasswordDto) {
		return await this.resetPasswordService.request(requestResetPasswordDto);
	}

	@Public()
	@Post('confirm')
	@HttpCode(200)
	@ApiOperation({
		summary: '비밀번호 초기화',
		description: '발급된 코드를 사용해 비밀번호를 변경합니다.',
	})
	@ApiResponse({
		status: 200,
		description: '변경 성공',
		type: BaseResponse<undefined>,
	})
	async confirm(@Body() confirmResetPasswordDto: ConfirmResetPasswordDto) {
		return await this.resetPasswordService.confirm(confirmResetPasswordDto);
	}
}
