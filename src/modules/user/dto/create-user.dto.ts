import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
	@IsEmail()
	@ApiProperty({
		type: 'string',
		example: 'example@example.com',
	})
	email: string;

	@IsString()
	@MinLength(8)
	@Matches(
		/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d`~!@#$%^&*()\-_=+\\|/?,.<>;:'"[\]{}]+$/,
	)
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
