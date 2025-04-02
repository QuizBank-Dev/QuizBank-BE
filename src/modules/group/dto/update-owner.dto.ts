import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOwnerDto {
	@ApiProperty({
		description: '새로운 그룹장 _id',
		example: '65e8a5d6fc13ae5e7f000002',
	})
	@IsString()
	@IsNotEmpty()
	memberId: string;
}
