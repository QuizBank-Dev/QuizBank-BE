import { Body, Controller, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { UpdateCategoriesDto } from './dto/update-categories.dto';
import { UserId } from '../../common/decorators/user-id.decorator';

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}
	@Put()
	setCategory(
		@UserId() userId: string,
		@Body() setCategoriesDto: UpdateCategoriesDto,
	) {
		return this.categoryService.setCategories(userId, setCategoriesDto);
	}
}
