import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsString,
	ValidateNested,
} from 'class-validator';
import { CategoryType } from '../schema/quizbook.schema';
import { QuizType } from 'src/modules/quiz/schema/quiz.schema';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateQuizDto } from 'src/modules/quiz/dto/create-quiz.dto';

export class CreateQuizbookDto {
	@ApiProperty({
		description: 'Quizbook 제목',
		example: '알고리즘 문제집',
	})
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty({
		description: 'Quibook 카테고리',
		enum: CategoryType,
		example: CategoryType.ALGORITHM,
	})
	@IsEnum(CategoryType)
	@IsNotEmpty()
	category: CategoryType;

	@ApiProperty({
		description: 'Quizbook 설명',
		example: '이 문제집은 알고리즘 면접을 준비하는 사람들을 위한 것입니다.',
	})
	@IsString()
	@IsNotEmpty()
	description: string;

	@ApiProperty({
		type: [CreateQuizDto],
		description: 'Quiz 목록',
		example: [
			{
				question: '퀵 정렬의 시간 복잡도는?',
				answer: 'O(n log n)',
				type: QuizType.MULTIPLE_CHOICE,
				optionList: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(1)'],
			},
		],
	})
	@IsNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateQuizDto)
	quizList: CreateQuizDto[];
}
