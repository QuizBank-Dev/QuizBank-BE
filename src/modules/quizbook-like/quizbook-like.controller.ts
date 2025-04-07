import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuizbookLikeService } from './quizbook-like.service';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { toggleQuizbookLikeDto } from './dto/toggle-quizbook-like.dto';
import { ApiBaseResponse } from 'src/common/decorators/base-response.decorator';
import {
	quizbookLikeByUserIdExample,
	toggleQuizbookLikeExample,
} from './quizbook-like.exmaple';

@Controller({
	path: 'quizbook-like',
	version: '1',
})
@ApiTags('Like')
export class QuizbookLikeController {
	constructor(private readonly quizbookLikeService: QuizbookLikeService) {}

	// POST v1/quizbook-like
	// 특정 Quizbook의 찜 상태를 변경한다.
	@Post()
	@ApiOperation({
		summary: '특정 Quizbook의 찜 상태 변경',
		description: '특정 Quizbook의 찜 상태를 Toggle 방식으로 변경합니다.',
	})
	@ApiBaseResponse(201, '변경 성공', toggleQuizbookLikeExample)
	postToggleQuizbookLike(
		@Body() dto: toggleQuizbookLikeDto,
		@UserId() userId: string,
	) {
		return this.quizbookLikeService.toggleQuizbookLike(dto, userId);
	}

	// GET v1/quizbook-like/me
	// 사용자의 찜 목록을 가져온다.
	@Get('me')
	@ApiOperation({
		summary: '사용자의 찜 목록 조회',
		description: '특정 사용자의 찜 목록을 가져옵니다.',
	})
	@ApiBaseResponse(200, '조회 성공', quizbookLikeByUserIdExample)
	getQuizbookLikeByUserId(@UserId() userId: string) {
		return this.quizbookLikeService.findQuizbookLikeByOwner(userId);
	}
}
