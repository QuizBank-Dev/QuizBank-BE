import { Injectable } from '@nestjs/common';
import { UpdateCategoriesDto } from './dto/update-categories.dto';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class CategoryService {
	constructor(private readonly userRepository: UserRepository) {}

	setCategories(id: string, { categories }: UpdateCategoriesDto) {
		return this.userRepository.update(id, { category: categories });
	}
}
