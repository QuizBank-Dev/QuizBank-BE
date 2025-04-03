import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum FollowType {
	ALL = 'all',
	FOLLOWER = 'follower',
	FOLLOWING = 'following',
}

export class FollowQueryDto {
	@ApiProperty({
		description: '구독자 타입',
		default: FollowType.ALL,
	})
	@IsOptional()
	@IsEnum(FollowType)
	type?: FollowType;
}

export class RemoveFollowQueryDto {
	@ApiProperty({
		description: '구독자 타입',
		type: 'string',
		enum: [FollowType.FOLLOWER, FollowType.FOLLOWING],
		default: FollowType.FOLLOWER,
	})
	@IsOptional()
	@IsEnum(FollowType)
	type?: Exclude<FollowType, FollowType.ALL>;
}
