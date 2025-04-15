import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional } from 'class-validator';

export class getStudyLogDto {
	@ApiProperty({
		description: 'X: 이번주, O: (offset)주 전',
	})
	@IsOptional()
	@IsNumber()
	offset?: number;

	@ApiProperty({
		description: 'X: 로그인된 사용자, O: 전달된 사용자',
	})
	@IsOptional()
	@IsMongoId()
	userId?: string;
}
