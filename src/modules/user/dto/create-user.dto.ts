import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
	@IsEmail()
	@ApiProperty({
		type: 'string',
		example: 'example@example.com',
	})
	email: string;

	@IsString()
	@ApiProperty({
		type: 'string',
		example: 'password12',
	})
	password: string;

	@IsString()
	@ApiProperty({
		type: 'string',
		example: '닉네임123',
	})
	nickname: string;
}
