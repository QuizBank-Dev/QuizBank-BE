import { ApiProperty } from '@nestjs/swagger';
import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';
import { QuizType } from '../schema/quiz.schema';

export class CreateQuizDto {
	@ApiProperty({
		example: '퀵 정렬의 시간 복잡도는?',
		description: '퀴즈 질문',
	})
	@IsString()
	@IsNotEmpty()
	question: string;

	@ApiProperty({
		example: 'O(n log n)',
		description: '퀴즈 정답',
	})
	@IsString()
	@IsNotEmpty()
	answer: string;

	@ApiProperty({
		enum: QuizType,
		example: QuizType.MULTIPLE_CHOICE,
		description: '퀴즈 유형',
	})
	@IsEnum(QuizType)
	type: QuizType;

	@ApiProperty({
		example: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(1)'],
		description: '객관식 문제의 선택지 (객관식일 경우 필수)',
		required: false,
	})
	@IsOptional()
	@IsArray()
	@ArrayMaxSize(4)
	@ArrayMinSize(4)
	optionList?: string[];
}
