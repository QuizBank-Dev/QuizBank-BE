import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Query,
	HttpStatus,
} from '@nestjs/common';
import { QuizbookService } from './quizbook.service';
import { CreateQuizbookDto } from './dto/create-quizbook.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBaseResponse } from 'src/common/decorators/base-response.decorator';
import { Public } from '../auth/decorator/public.decorator';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { GetQuizbookListDto } from './dto/get-quizbook-list.dto';
import { PaginationRequestDto } from 'src/common/dto/pagination.dto';
import {
	getQuizbookListEx,
	getQuizbookMetaDataEx,
	getQuizbookStatesEx,
	getQuizbookUserFlagsEx,
} from './quizbook.example';

@Controller({
	path: 'quizbook',
	version: '1',
})
@ApiTags('Quizbook')
export class QuizbookController {
	constructor(private readonly quizbookService: QuizbookService) {}

	// POST v1/quizbook
	@Post()
	@ApiOperation({
		summary: 'Quizbook 생성',
		description: 'Quizbook 생성',
	})
	@ApiBaseResponse(201, '생성 성공')
	createQuizbook(@Body() dto: CreateQuizbookDto, @UserId() userId: string) {
		return this.quizbookService.createQuizbook(dto, userId);
	}

	// GET v1/quizbook
	@Public()
	@Get()
	@ApiOperation({
		summary: '모든 Quizbook 조회',
		description:
			'[문제집 리스트]에 필요한 Quizbook 목록 조회 (문제집 카드에 필요한 정보 포함)',
	})
	@ApiBaseResponse(HttpStatus.OK, '조회 성공', getQuizbookListEx)
	getQuizbookList(
		@Query() query: GetQuizbookListDto,
		@UserId(true) userId?: string,
	) {
		return this.quizbookService.getQuizbookList(query, userId);
	}

	// GET v1/quizbook/author/me
	@Get('author/me')
	@ApiOperation({
		summary: '사용자가 작성한 모든 Quizbook 조회',
		description: '[내가 만든 문제집]에 필요한 Quizbook 목록 및 데이터',
	})
	@ApiBaseResponse(200, '조회 성공', getQuizbookListEx)
	getMyQuizbookList(
		@Query() dto: PaginationRequestDto,
		@UserId() userId: string,
	) {
		return this.quizbookService.getQuizbookListByUser(dto, userId);
	}

	// GET v1/quizbook/author/:authorId
	@Get('author/:authorId')
	@ApiOperation({
		summary: '특정 사용자가 작성한 모든 Quizbook 조회',
		description:
			'[다른 사용자의 프로필 => 생성한 문제집]에 필요한 Quizbook 목록 및 데이터',
	})
	@ApiBaseResponse(200, '조회 성공', getQuizbookListEx)
	getQuizbookListByAuthor(
		@Query() dto: PaginationRequestDto,
		@Param('authorId') authorId: string,
	) {
		return this.quizbookService.getQuizbookListByUser(dto, authorId);
	}

	// GET v1/quizbook/:quizbookId/meta-data
	@Public()
	@Get(':quizbookId/meta-data')
	@ApiOperation({
		summary: '특정 Quizbook의 메타 데이터 조회',
		description:
			'특정 Quizbook의 title, category, description, totalScore, quizbookList, author 조회',
	})
	@ApiBaseResponse(200, '조회 성공', getQuizbookMetaDataEx)
	getQuizbookhMetaData(@Param('quizbookId') quizbookId: string) {
		return this.quizbookService.getQuizbookMetaData(quizbookId);
	}

	// GET v1/quizbook/:quizbookId/user-flags
	@Get(':quizbookId/user-flags')
	@ApiOperation({
		summary: '특정 Quizbook의 사용자 Flags 조회',
		description: '특정 Quizbook의 isStudied, isLiked 조회',
	})
	@ApiBaseResponse(200, '조회 성공', getQuizbookUserFlagsEx)
	getQuizbookUserFlags(
		@Param('quizbookId') quizbookId: string,
		@UserId() userId: string,
	) {
		return this.quizbookService.getQuizbookUserFlags(quizbookId, userId);
	}

	// GET v1/quizbook/:quizbookId/states
	@Public()
	@Get(':quizbookId/states')
	@ApiOperation({
		summary: '특정 Quizbook의 통계 States 조회',
		description:
			'특정 Quizbook의 solvedCount, solvedScore, totalScore, reviewCount, reviewScore, reviewRating, createdAt, updatedAt 조회',
	})
	@ApiBaseResponse(200, '조회 성공', getQuizbookStatesEx)
	getQuizbookStates(@Param('quizbookId') quizbookId: string) {
		return this.quizbookService.getQuizbookStates(quizbookId);
	}
}
