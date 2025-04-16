import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express';

export class UpdateProfileDto {
	@ApiProperty({
		description: '닉네임',
		example: 'nickname1',
	})
	@IsString()
	@IsOptional()
	nickname?: string;

	@ApiProperty({
		description: '소개',
		example: 'Hello, world!',
	})
	@IsString()
	@IsOptional()
	introduce?: string;

	@ApiProperty({
		description: '프로필 이미지',
		example: undefined,
		type: 'string',
		format: 'binary',
	})
	@IsOptional()
	profileImg?: Express.Multer.File;
}
