import { IsEmail } from 'class-validator';

export class GenerateEmailVerificationCodeDto {
	@IsEmail()
	email: string;
}
