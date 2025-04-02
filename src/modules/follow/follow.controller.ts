import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { IsObjectIdPipe } from '@nestjs/mongoose';
import { FollowService } from './follow.service';
import { FollowType } from './follow.types';
import { UserId } from '../../common/decorators/user-id.decorator';

@Controller('follow')
export class FollowController {
	constructor(private readonly followService: FollowService) {}

	@Get()
	getMyFollowList(@UserId() userId: string, @Query('type') type: FollowType) {
		return this.followService.getAllFollower(userId, type || 'all');
	}

	@Post(':targetId')
	follow(
		@UserId() userId: string,
		@Param('targetId', IsObjectIdPipe) targetId: string,
	) {
		return this.followService.follow(userId, targetId);
	}

	@Delete(':targetId')
	removeFollow(
		@UserId() userId: string,
		@Param('targetId', IsObjectIdPipe) targetId: string,
		@Query('type') type: Exclude<FollowType, 'all'>,
	) {
		return this.followService.removeFollow(
			userId,
			targetId,
			type || 'follower',
		);
	}
}
