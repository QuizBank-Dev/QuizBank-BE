import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GroupQuizbookQueryDto {
	@ApiProperty({
		description: '기준이 되는 Group 선정 문제집 마감일',
		example: '2025-04-02',
	})
	@IsNotEmpty()
	@IsString()
	cursor: string;

	@ApiProperty({
		description: '불러올 항목 개수',
		example: 10,
	})
	@IsNotEmpty()
	@IsNumber()
	@Transform(({ value }) => Number(value))
	limit: number;

	@ApiProperty({
		description: '마감일 완료 여부',
		example: true,
	})
	@IsNotEmpty()
	@IsBoolean()
	@Transform(({ value }) => Boolean(value))
	done: boolean;
}
