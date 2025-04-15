import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class RespondApplicationDto {
	@ApiProperty({
		description: 'Group 가입 요청에 대한 수락 여부',
		example: true,
	})
	@IsBoolean()
	@IsNotEmpty()
	accepted: boolean;
}
