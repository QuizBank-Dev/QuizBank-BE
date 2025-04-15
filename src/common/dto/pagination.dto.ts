import { IsNumber, IsOptional } from 'class-validator';
import { CursorValue } from '../utils/pagination.util';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationRequestDto {
	@ApiProperty({
		type: String,
		required: false,
		example: '{"_id":"67e2e20e5872c849d5dd4b86"}',
		description: 'Response 받은 NextCursor 필드를 JSON.stringify 후 전달',
	})
	@Transform(({ value }) => {
		try {
			return value
				? (JSON.parse(value as string) as Record<string, CursorValue>)
				: undefined;
		} catch {
			return undefined;
		}
	})
	@IsOptional()
	cursor?: Record<string, CursorValue>;

	@IsOptional()
	@IsNumber()
	limit?: number;
}

export class PaginationResponseDto<T> {
	data: T[];
	nextCursor: Record<string, any> | null;
	totalCount: number;
}
