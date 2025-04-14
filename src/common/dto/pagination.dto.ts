import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional } from 'class-validator';

export class PaginationRequestDto {
	@ApiProperty({})
	@IsOptional()
	@IsMongoId()
	cursor?: string;

	@ApiProperty({})
	@IsOptional()
	@IsNumber()
	limit?: number;
}

export class PaginationResponseDto<T> {
	data: T[];
	nextCursor: string | null;
	totalCount: number;
}
