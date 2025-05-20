import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsMongoId,
	IsNotEmpty,
	IsString,
	ValidateNested,
} from 'class-validator';

export class QuizAnswerDto {
	@ApiProperty({
		description: 'Quiz ObjectId',
		example: '65e8a5d6fc13ae5e7f000002',
	})
	@IsMongoId()
	@IsNotEmpty()
	quizId: string;

	@ApiProperty({
		description: '사용자가 작성한 답안',
		example: 'O(n log n)',
	})
	@IsString()
	answer: string;
}

export class SubmitStudyDto {
	@ApiProperty({
		description: 'Quizbook ObjectId',
		example: '65e8a5d6fc13ae5e7f000002',
	})
	@IsMongoId()
	@IsNotEmpty()
	quizbookId: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => QuizAnswerDto)
	answerList: QuizAnswerDto[];
}
