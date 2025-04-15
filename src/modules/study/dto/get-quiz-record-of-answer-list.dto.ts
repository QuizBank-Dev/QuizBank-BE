import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';
import { PaginationRequestDto } from 'src/common/dto/pagination.dto';

export class GetQuizRecordOfAnswerList extends PaginationRequestDto {
	@ApiProperty({
		description: '전달시 Group멤버의 답안 조회',
	})
	@IsOptional()
	@IsMongoId()
	groupId?: string;
}
