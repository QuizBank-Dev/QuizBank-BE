import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { IsObjectIdPipe } from '@nestjs/mongoose';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FollowService } from './follow.service';
import {
	FollowType,
	FollowQueryDto,
	RemoveFollowQueryDto,
} from './dto/follow-query.dto';
import { UserId } from '../../common/decorators/user-id.decorator';
import { ApiBaseResponse } from '../../common/decorators/base-response.decorator';
import { allExample } from './follow.example';

@Controller({ path: 'follow', version: '1' })
@ApiTags('Follow')
export class FollowController {
	constructor(private readonly followService: FollowService) {}

	@Get()
	@ApiOperation({
		summary: '팔로워/팔로잉 목록 조회',
		description: '팔로워, 팔로잉 목록을 조회합니다.',
	})
	@ApiBaseResponse(200, '조회 성공', allExample)
	getMyFollowList(
		@UserId() userId: string,
		@Query() { type }: FollowQueryDto,
	) {
		return this.followService.getAllFollower(
			userId,
			type || FollowType.ALL,
		);
	}

	@Post(':targetId')
	@ApiOperation({
		summary: '팔로우',
		description: '타겟 사용자를 팔로우합니다.',
	})
	@ApiBaseResponse(201, '팔로우 성공')
	follow(
		@UserId() userId: string,
		@Param('targetId', IsObjectIdPipe) targetId: string,
	) {
		return this.followService.follow(userId, targetId);
	}

	@Delete(':targetId')
	@ApiOperation({
		summary: '팔로우 취소',
		description: '타겟 사용자를 팔로우 취소합니다.',
	})
	@ApiBaseResponse(200, '취소 성공')
	async removeFollow(
		@UserId() userId: string,
		@Param('targetId', IsObjectIdPipe) targetId: string,
		@Query() { type }: RemoveFollowQueryDto,
	) {
		await this.followService.removeFollow(
			userId,
			targetId,
			type || FollowType.FOLLOWER,
		);
	}
}
