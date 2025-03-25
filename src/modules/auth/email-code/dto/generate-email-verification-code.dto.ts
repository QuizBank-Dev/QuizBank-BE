import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateEmailVerificationCodeDto {
	@IsEmail()
	@ApiProperty({
		type: 'string',
		example: 'example@example.com',
	})
	email: string;
}
