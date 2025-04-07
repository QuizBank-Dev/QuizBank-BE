import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class toggleQuizLikeDto {
	@ApiProperty({
		description: 'Quiz의 ObjectId',
		example: '65e8a5d6fc13ae5e7f000004',
	})
	@IsMongoId()
	@IsNotEmpty()
	quizId: string;
}
