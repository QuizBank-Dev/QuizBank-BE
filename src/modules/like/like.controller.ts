import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LikeService } from './like.service';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { toggleQuizbookLikeDto } from './dto/toggle-quizbook-like.dto';
import { ApiBaseResponse } from 'src/common/decorators/base-response.decorator';
import {
	likeByUserIdWithQuizbookList,
	likeByUserIdWithQuizList,
	toggleLikeExample,
} from './like.exmaple';
import { toggleQuizLikeDto } from './dto/toggle-quiz-like.dto';

@Controller({
	path: 'like',
	version: '1',
})
@ApiTags('Like')
export class LikeController {
	constructor(private readonly likeService: LikeService) {}

	// POST v1/like/quizbook
	// 특정 Quizbook의 찜 상태를 변경한다.
	@Post('quizbook')
	@ApiOperation({
		summary: '특정 Quizbook의 찜 상태 변경',
		description: '특정 Quizbook의 찜 상태를 Toggle 방식으로 변경합니다.',
	})
	@ApiBaseResponse(201, '변경 성공', toggleLikeExample)
	postToggleQuizbookLike(
		@Body() dto: toggleQuizbookLikeDto,
		@UserId() userId: string,
	) {
		return this.likeService.toggleQuizbookLike(dto, userId);
	}

	// GET v1/like/quizbook/me
	// 사용자의 찜한 Quizbook 목록을 가져온다.
	@Get('quizbook/me')
	@ApiOperation({
		summary: '사용자가 찜한 Quizbook 목록 조회',
		description: '사용자가 찜한 Quizbook 목록을 가져옵니다.',
	})
	@ApiBaseResponse(200, '조회 성공', likeByUserIdWithQuizbookList)
	getLikeByUserIdWithQuizbookList(@UserId() userId: string) {
		return this.likeService.findOneByOwnerWithQuizbookList(userId);
	}

	// POST v1/like/quiz
	// 특정 Quiz의 찜 상태를 변경한다.
	@Post('quiz')
	@ApiOperation({
		summary: '특정 Quiz의 찜 상태 변경',
		description: '특정 Quiz의 찜 상태를 Toggle 방식으로 변경합니다.',
	})
	@ApiBaseResponse(201, '변경 성공', toggleLikeExample)
	postToggleQuizLike(
		@Body() dto: toggleQuizLikeDto,
		@UserId() userId: string,
	) {
		return this.likeService.toggleQuizLike(dto, userId);
	}

	// GET v1/like/quiz/me
	// 사용자의 찜한 Quiz 목록을 가져온다.
	@Get('quiz/me')
	@ApiOperation({
		summary: '사용자가 찜한 Quiz 목록 조회',
		description: '사용자가 찜한 Quiz 목록을 가져옵니다.',
	})
	@ApiBaseResponse(200, '조회 성공', likeByUserIdWithQuizList)
	getLikeByUserIdWithQuizList(@UserId() userId: string) {
		return this.likeService.findOneByOwnerWithQuizList(userId);
	}
}
