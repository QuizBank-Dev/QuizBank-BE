import { ApiProperty } from '@nestjs/swagger';
import {
	IsDateString,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

export class ChatQueryDto {
	@ApiProperty({
		description: '기준이 되는 특정 시간',
		example: '2025-04-07',
	})
	@IsDateString()
	@IsOptional()
	cursor?: string;

	@ApiProperty({
		description: '조회될 채팅 개수',
		example: '10',
	})
	@IsString()
	@IsNotEmpty()
	take: string;
}
