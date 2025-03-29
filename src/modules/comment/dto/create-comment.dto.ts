import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
	@ApiProperty({
		example: '65e8a5d6fc13ae5e7f000002',
		description: 'Quiz ObjectId',
	})
	@IsString()
	@IsNotEmpty()
	quizId: string;

	@ApiProperty({
		example: '이 문제 답이 좀 이상하지 않나요?',
		description: 'Comment 내용',
	})
	@IsString()
	@IsNotEmpty()
	content: string;

	@ApiProperty({
		example: '65e8a5d6fc13ae5e7f000003',
		description: '상위 Comment ObjectId (대댓글인 경우)',
		required: false,
	})
	@IsOptional()
	@IsString()
	commentId?: string;
}
