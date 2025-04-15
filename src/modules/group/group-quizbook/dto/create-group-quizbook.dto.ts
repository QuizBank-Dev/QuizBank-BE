import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateGroupQuizbookDto {
	@ApiProperty({
		description: 'Group 선정 문제집 마감일',
		example: '2025-04-02',
	})
	@IsDate()
	@IsNotEmpty()
	@Type(() => Date)
	endDate: Date;
}
