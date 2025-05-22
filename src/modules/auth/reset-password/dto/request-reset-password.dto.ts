import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestResetPasswordDto {
	@IsEmail()
	@ApiProperty({
		type: 'string',
		example: 'example@example.com',
	})
	email: string;
}
