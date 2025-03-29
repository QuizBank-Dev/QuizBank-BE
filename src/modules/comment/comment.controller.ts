import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ApiBaseResponse } from 'src/common/decorators/base-response.decorator';
import {
	commentBaseExample,
	commentDetailExample,
	commentPreviewExample,
} from './comment.example';

@Controller({
	path: 'comment',
	version: '1',
})
export class CommentController {
	constructor(private readonly commentService: CommentService) {}

	// POST v1/comment
	// 특정 Quiz에 대한 Comment를 생성한다.
	@Post()
	@ApiOperation({
		summary: 'Comment 생성',
		description:
			'특정 Quiz에 대한 Comment를 생성합니다. (commentId 전달시 ReComment로 인식)',
	})
	@ApiBaseResponse(201, '생성 성공', commentBaseExample)
	createComment(@Body() dto: CreateCommentDto, @UserId() userId: string) {
		return this.commentService.createComment(dto, userId);
	}

	// GET v1/comment?quizId
	// 특정 Quiz에 대한 모든 Comment를 가져온다.
	@Get()
	@ApiOperation({
		summary: 'Comment 조회',
		description: '특정 Quiz에 대한 최상위 Comment를 가져옵니다.',
	})
	@ApiBaseResponse(200, '조회 성공', [commentPreviewExample])
	getAllCommentByQuizId(@Query('quizId') quizId: string) {
		return this.commentService.getCommentList(quizId);
	}

	// GET v1/comment/me
	// 사용자가 작성한 Comment를 가져온다.
	@Get('me')
	@ApiOperation({
		summary: '사용자가 작성한 모든 Comment 조회',
		description: '사용자가 작성한 모든 Comment를 가져옵니다.',
	})
	@ApiBaseResponse(200, '조회 성공', [commentPreviewExample])
	getAllCommentByUserId(@UserId() userId: string) {
		return this.commentService.getCommentListByUserId(userId);
	}

	// GET v1/comment/:commentId
	// 특정 Comment의 상세정보(ReComment포함)를 가져온다.
	@Get(':commentId')
	@ApiOperation({
		summary: '특정 Comment 상세정보 조회',
		description:
			'특정 Comment의 상세정보를 가져옵니다. (replies 정보 포함)',
	})
	@ApiBaseResponse(200, '조회 성공', commentDetailExample)
	getCommentById(@Param('commentId') commentId: string) {
		return this.commentService.getCommentDetail(commentId);
	}

	// PATCH v1/comment/:commentId
	// 특정 Comment를 수정한다.
	@Patch(':commentId')
	@ApiOperation({
		summary: 'Comment 수정',
		description: '특정 Comment를 수정합니다.',
	})
	@ApiBaseResponse(200, '수정 성공', commentBaseExample)
	updateComment(
		@Param('commentId') commentId: string,
		@Body() dto: UpdateCommentDto,
		@UserId() userId: string,
	) {
		return this.commentService.updateComment(dto, commentId, userId);
	}

	// DELETE v1/comment/:commentId
	// 특정 Comment를 삭제한다.
	@Delete(':commentId')
	@ApiOperation({
		summary: 'Comment 삭제',
		description:
			'특정 Comment를 삭제합니다. (replies ? Soft Delete : Hard Delete)',
	})
	@ApiBaseResponse(200, '삭제 성공')
	deleteComment(
		@Param('commentId') commentId: string,
		@UserId() userId: string,
	) {
		return this.commentService.removeComment(commentId, userId);
	}
}
