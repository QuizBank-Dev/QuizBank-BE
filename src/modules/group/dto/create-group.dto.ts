import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
	@ApiProperty({
		description: 'Group 이름',
		example: '서울 강남 cs 공부 스터디',
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		description: 'Group 소개',
		example: '서울에 사는 컴공 취준생들의 cs 공부 스터디 그룹입니다.',
	})
	@IsString()
	@IsNotEmpty()
	description: string;
}
