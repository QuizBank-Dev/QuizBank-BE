import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
	@ApiProperty({
		example: '65e8a5d6fc13ae5e7f000002',
		description: 'Quizbook ObjectId',
	})
	@IsString()
	@IsNotEmpty()
	quizbookId: string;

	@ApiProperty({
		example: 5,
		description: 'Quizbook 평점(0 ~ 5)',
	})
	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	@Max(5)
	score: number;

	@ApiProperty({
		example: '너무 좋은 문제였습니다!',
		description: 'Review 내용',
	})
	@IsString()
	@IsNotEmpty()
	content: string;
}
