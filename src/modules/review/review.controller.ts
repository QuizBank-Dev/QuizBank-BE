import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBaseResponse } from 'src/common/decorators/base-response.decorator';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { Public } from '../auth/decorator/public.decorator';
import { PaginationRequestDto } from 'src/common/dto/pagination.dto';
import { getReviewListEx } from './review.example';

@Controller({
	path: 'review',
	version: '1',
})
@ApiTags('Review')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	// POST v1/review
	// 특정 Quizbook에 대한 Review를 생성한다.
	@Post()
	@ApiOperation({
		summary: 'Review 생성',
		description: '특정 Quizbook에 대한 Review를 생성합니다.',
	})
	@ApiBaseResponse(201, '생성 성공')
	createReview(@Body() dto: CreateReviewDto, @UserId() userId: string) {
		return this.reviewService.createReview(dto, userId);
	}

	// GET v1/review/quizbook/:quizbookId
	// 특정 Quizbook에 대한 Review를 가져온다.
	@Public()
	@Get('/quizbook/:quizbookId')
	@ApiOperation({
		summary: 'Review 조회',
		description: '특정 Quizbook에 대한 모든 Review를 가져옵니다.',
	})
	@ApiBaseResponse(200, '조회 성공', getReviewListEx)
	getReviewList(
		@Query() dto: PaginationRequestDto,
		@Param('quizbookId') quizbookId: string,
		@UserId() userId?: string,
	) {
		return this.reviewService.getReviewList(dto, quizbookId, userId);
	}

	// PATCH v1/review/:reviewId
	// 특정 Review를 수정한다.
	@Patch(':reviewId')
	@ApiOperation({
		summary: 'Review 수정',
		description: '특정 Review를 수정합니다.',
	})
	@ApiBaseResponse(200, '수정 성공')
	updateReview(
		@Param('reviewId') reviewId: string,
		@Body() dto: UpdateReviewDto,
		@UserId() userId: string,
	) {
		return this.reviewService.updateReview(dto, reviewId, userId);
	}

	// DELETE v1/review/:reviewId
	// 특정 Review를 삭제한다.
	@Delete(':reviewId')
	@ApiOperation({
		summary: 'Review 삭제',
		description: '특정 Review를 삭제합니다.',
	})
	@ApiBaseResponse(200, '삭제 성공')
	deleteReview(
		@Param('reviewId') reviewId: string,
		@UserId() userId: string,
	) {
		return this.reviewService.removeReview(reviewId, userId);
	}
}
