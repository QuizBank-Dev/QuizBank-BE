import { Body, Controller, Post } from '@nestjs/common';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ConfirmResetPasswordDto } from './dto/confirm-reset-password.dto';
import { ResetPasswordService } from './reset-password.service';

@Controller('reset-password')
export class ResetPasswordController {
	constructor(private readonly resetPasswordService: ResetPasswordService) {}

	@Post('request')
	async request(@Body() requestResetPasswordDto: RequestResetPasswordDto) {
		return await this.resetPasswordService.request(requestResetPasswordDto);
	}

	@Post('confirm')
	confirm(@Body() confirmResetPasswordDto: ConfirmResetPasswordDto) {
		console.log(confirmResetPasswordDto);
		return {};
	}
}
