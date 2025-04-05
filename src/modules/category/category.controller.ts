import { Body, Controller, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { UpdateCategoriesDto } from './dto/update-categories.dto';
import { UserId } from '../../common/decorators/user-id.decorator';
import { ApiBaseResponse } from '../../common/decorators/base-response.decorator';

@Controller({ path: 'category', version: '1' })
@ApiTags('Category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Put()
	@ApiOperation({
		summary: '카테고리 설정',
		description: '사용자의 카테고리를 설정합니다.',
	})
	@ApiBaseResponse(200, '설정 성공')
	setCategory(
		@UserId() userId: string,
		@Body() setCategoriesDto: UpdateCategoriesDto,
	) {
		return this.categoryService.setCategories(userId, setCategoriesDto);
	}
}
