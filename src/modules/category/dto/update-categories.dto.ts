import { ArrayMinSize, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryType } from '../../quizbook/schema/quizbook.schema';

export class UpdateCategoriesDto {
	@ApiProperty({
		description: '선호 카테고리',
		example: [CategoryType.ALGORITHM],
	})
	@IsArray()
	@ArrayMinSize(1)
	categories: CategoryType[];
}
