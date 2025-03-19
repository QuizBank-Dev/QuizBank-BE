import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { CategoryType } from '../schema/quizbook.schema';
import { QuizType } from 'src/modules/quiz/schema/quiz.schema';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QuizItemDto {
	@ApiProperty({
		example: '퀵 정렬의 시간 복잡도는?',
		description: '퀴즈 질문',
	})
	@IsString({
		message: "'question' 필드는 문자열(String) 형식이어야 합니다.",
	})
	@IsNotEmpty({ message: "'question' 필드는 필수 입력 항목입니다." })
	question: string;

	@ApiProperty({
		example: 'O(n log n)',
		description: '퀴즈 정답',
	})
	@IsString({ message: "'answer' 필드는 문자열(String) 형식이어야 합니다." })
	@IsNotEmpty({ message: "'answer' 필드는 필수 입력 항목입니다." })
	answer: string;

	@ApiProperty({
		enum: QuizType,
		example: QuizType.MULTIPLE_CHOICE,
		description: '퀴즈 유형',
	})
	@IsEnum(QuizType, { message: "'type' 값은 유효한 퀴즈 유형이어야 합니다." })
	type: QuizType;

	@ApiProperty({
		example: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(1)'],
		description: '객관식 문제의 선택지 (객관식일 경우 필수)',
		required: false,
	})
	@IsOptional()
	@IsArray({ message: "'options' 필드는 배열(Array) 형식이어야 합니다." })
	@ArrayMaxSize(4, {
		message: "'options' 필드는 정확히 4개의 항목을 포함해야 합니다.",
	})
	@ArrayMinSize(4, {
		message: "'options' 필드는 정확히 4개의 항목을 포함해야 합니다.",
	})
	options?: string[];
}

export class CreateQuizbookDto {
	@ApiProperty({
		example: '알고리즘 문제집',
		description: '퀴즈북 제목',
	})
	@IsString({ message: "'title' 필드는 문자열(String) 타입이어야 합니다." })
	@IsNotEmpty({ message: "'title' 필드는 필수 입력 항목 입니다." })
	title: string;

	@ApiProperty({
		example: CategoryType.ALGORITHM,
		enum: CategoryType,
		description: '문제집 카테고리',
	})
	@IsEnum(CategoryType, {
		message: "'category' 필드의 값은 유효한 카테고리 값이어야 합니다.",
	})
	@IsNotEmpty({ message: "'category' 필드는 필수 입력 항목 입니다." })
	category: CategoryType;

	@ApiProperty({
		example: '이 문제집은 알고리즘 면접을 준비하는 사람들을 위한 것입니다.',
		description: '문제집 설명',
	})
	@IsString({
		message: "'description' 필드는 문자열(String) 타입이어야 합니다.",
	})
	@IsNotEmpty({ message: "'description' 필드는 필수 입력 항목 입니다." })
	description: string;

	@ApiProperty({
		type: [QuizItemDto],
		description: '퀴즈 리스트',
		example: [
			{
				question: '퀵 정렬의 시간 복잡도는?',
				answer: 'O(n log n)',
				type: QuizType.MULTIPLE_CHOICE,
				optionList: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(1)'],
			},
		],
	})
	@IsNotEmpty({
		message: "'quizbook' 필드는 배열(Array) 형식이어야 합니다.",
	})
	@ValidateNested({ each: true })
	@Type(() => QuizItemDto)
	quizList: QuizItemDto[];
}
