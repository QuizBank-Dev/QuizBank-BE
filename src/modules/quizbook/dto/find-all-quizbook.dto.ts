import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindAllQuizbookDto {
	@ApiProperty({
		type: String,
		description: '(title, description, category) 검색',
	})
	@IsOptional()
	@IsString()
	keyword?: string;
}
