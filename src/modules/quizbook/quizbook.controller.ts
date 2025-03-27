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
import {
	quizbookBaseExample,
	quizbookDetailExample,
	quizbookPreviewExample,
} from './quizbook.example';
import { FindAllQuizbookDto } from './dto/find-all-quizbook.dto';

@Controller({
	path: 'quizbook',
	version: '1',
})
@ApiTags('Quizbook')
export class QuizbookController {
	constructor(private readonly quizbookService: QuizbookService) {}

	// POST v1/quizbook
	// Quizbook을 생성한다.
	@Post()
	@ApiOperation({
		summary: 'Quizbook 생성',
		description: 'Quizbook을 생성합니다.',
	})
	@ApiBaseResponse(201, '생성 성공', quizbookBaseExample)
	createQuizbook(
		@Body() createQuizbookDto: CreateQuizbookDto,
		@UserId() userId: string,
	) {
		return this.quizbookService.createQuizbook(createQuizbookDto, userId);
	}

	// GET v1/quizbook
	// 모든 Quizbook을 가져온다.
	@Public()
	@Get()
	@ApiOperation({
		summary: '모든 Quizbook 조회',
		description: '모든 Quizbook을 가져옵니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '조회 성공', [quizbookPreviewExample])
	getAllQuizbook(@Query() query: FindAllQuizbookDto) {
		return this.quizbookService.getQuizbookList(query);
	}

	// GET v1/quizbook/:quizbookId
	// 특정 Quizbook의 상세정보를 가져온다.
	@Public()
	@Get(':quizbookId')
	@ApiOperation({
		summary: 'Quizbook 상세 조회',
		description: 'Quizbook의 상세정보를 가져옵니다.',
	})
	@ApiBaseResponse(200, '조회 성공', quizbookDetailExample)
	getQuizbookById(@Param('quizbookId') quizbookId: string) {
		return this.quizbookService.getQuizbookDetail(quizbookId);
	}
}
