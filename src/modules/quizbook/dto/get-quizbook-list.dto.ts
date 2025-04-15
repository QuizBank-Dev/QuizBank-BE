import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequestDto } from 'src/common/dto/pagination.dto';
import { CategoryType } from '../schema/quizbook.schema';

export enum QuizbookSortType {
	CREATED_AT = 'latest',
	REVIEW_SCORE = 'rating',
}

export class GetQuizbookListDto extends PaginationRequestDto {
	@IsOptional()
	@IsString()
	keyword?: string;

	@IsOptional()
	@IsEnum(CategoryType)
	category?: CategoryType;

	@IsOptional()
	@IsEnum(QuizbookSortType)
	sort?: QuizbookSortType;
}
