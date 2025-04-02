import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupMemberDto {
	@ApiProperty({
		description: '초대 토큰',
		example: 'dsdf54842ds1f85s4dg6sd454156sdf',
	})
	@IsString()
	@IsNotEmpty()
	inviteCode: string;
}
