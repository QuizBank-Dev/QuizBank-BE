import { IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
	@IsString()
	@ApiProperty({
		type: 'string',
		example: 'password12',
		description: '이전 비밀번호',
	})
	password: string;

	@IsString()
	@MinLength(8)
	@Matches(
		/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d`~!@#$%^&*()\-_=+\\|/?,.<>;:'"[\]{}]+$/,
	)
	@ApiProperty({
		type: 'string',
		example: 'password1234',
		description: '변경할 비밀번호',
	})
	newPassword: string;
}
