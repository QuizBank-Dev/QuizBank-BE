import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
	@IsString()
	@IsOptional()
	nickname: string | undefined;

	@IsString()
	@IsOptional()
	introduce: string | undefined;

	@IsOptional()
	profileImg: File | undefined;
}
