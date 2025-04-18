import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	IsBoolean,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';

export class GroupQueryDto {
	@ApiProperty({
		description: '기준이 되는 Group의 ObjectId',
		example: '65e8a5d6fc13ae5e7f000002',
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
		description: 'Group 제목 검색',
		example: '서울',
	})
	@IsOptional()
	@IsString()
	name?: string;
}
