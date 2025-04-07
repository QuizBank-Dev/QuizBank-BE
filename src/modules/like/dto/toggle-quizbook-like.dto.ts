import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class toggleQuizbookLikeDto {
	@ApiProperty({
		description: 'Quizbook의 ObjectId',
		example: '65e8a5d6fc13ae5e7f000004',
	})
	@IsMongoId()
	@IsNotEmpty()
	quizbookId: string;
}
