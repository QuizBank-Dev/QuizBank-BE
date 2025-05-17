import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GroupQuizbookQueryDto {
	@ApiProperty({
		description: '조회 시간대',
		example: '2025-04-02',
	})
	@IsNotEmpty()
	@IsString()
	standard: string;

	@ApiProperty({
		description: '무한스크롤 커서가 되는 Group 선정 문제집 마감일',
		example: '2025-04-02',
	})
	@IsOptional()
	@IsString()
	cursor?: string;

	@ApiProperty({
		description: '불러올 항목 개수',
		example: 10,
	})
	@IsNotEmpty()
	@IsNumber()
	@Transform(({ value }) => Number(value))
	limit: number;

	@ApiProperty({
		description: '마감 상태',
		example: 'in-progress',
	})
	@IsNotEmpty()
	@IsString()
	status: string;

	@ApiProperty({
		description: '정렬 방향',
		example: 'increase',
	})
	@IsNotEmpty()
	@IsString()
	sort: string;
}
