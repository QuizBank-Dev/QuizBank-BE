import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailVerificationDto {
	@IsEmail()
	@ApiProperty({
		type: 'string',
		example: 'example@example.com',
	})
	email: string;

	@IsString()
	@ApiProperty({
		type: 'string',
		example: 'BA76J8',
	})
	code: string;
}
