import { ArrayMinSize, IsArray } from 'class-validator';
import { CategoryType } from '../../quizbook/schema/quizbook.schema';

export class UpdateCategoriesDto {
	@IsArray()
	@ArrayMinSize(1)
	categories: CategoryType[];
}
