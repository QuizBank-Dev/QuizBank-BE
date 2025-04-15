import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
	@IsString()
	@IsNotEmpty()
	quizbookId: string;

	@ApiProperty({
		description: 'Quizbook 평점(0 - 5)',
	})
	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	@Max(5)
	score: number;

	@IsString()
	@IsNotEmpty()
	content: string;
}
