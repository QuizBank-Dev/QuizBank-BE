import { Injectable } from '@nestjs/common';
import { UpdateCategoriesDto } from './dto/update-categories.dto';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class CategoryService {
	constructor(private readonly userRepository: UserRepository) {}

	/**
	 * 카테고리 설정
	 * @param userId
	 * @param categories
	 */
	setCategories(userId: string, { categories }: UpdateCategoriesDto) {
		return this.userRepository.update(userId, { category: categories });
	}
}
