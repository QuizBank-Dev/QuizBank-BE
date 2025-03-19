import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CategoryType } from '../schema/quizbook.schema';

export class FindAllQuizbookDto {
	@ApiPropertyOptional({ description: '문제집 제목' })
	@IsOptional()
	@IsString()
	title?: string;

	@ApiPropertyOptional({
		description: '문제집 설명',
	})
	@IsOptional()
	@IsString()
	description?: string;

	@ApiPropertyOptional({ description: '문제집 카테고리', enum: CategoryType })
	@IsOptional()
	@IsEnum(CategoryType)
	category?: CategoryType;
}
