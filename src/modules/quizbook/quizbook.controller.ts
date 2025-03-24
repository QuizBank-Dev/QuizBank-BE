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
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindAllQuizbookDto } from './dto/find-all-quizbook.dto';
import { ApiBaseResponse } from 'src/common/decorators/base-response.decorator';
import { Quiz } from '../quiz/schema/quiz.schema';
import {
	QuizbookCreateResponseDto,
	QuizbookFindAllResponseDto,
	QuizbookFindOneResponseDto,
} from './dto/response-quizbook.dto';

@Controller({
	path: 'quizbook',
	version: '1',
})
@ApiTags('Quizbook')
export class QuizbookController {
	constructor(private readonly quizbookService: QuizbookService) {}

	// POST v1/quizbook
	// 문제집을 생성한다.
	@Post()
	@ApiOperation({
		summary: '문제집 생성',
		description: '문제집을 생성합니다.',
	})
	@ApiBaseResponse(QuizbookCreateResponseDto, HttpStatus.CREATED, '생성 성공')
	async create(@Body() createQuizbookDto: CreateQuizbookDto) {
		return this.quizbookService.create(createQuizbookDto);
	}

	// GET v1/quizbook
	// 모든 문제집을 가져온다.
	@Get()
	@ApiOperation({
		summary: '모든 문제집 조회',
		description: '모든 문제집을 가져옵니다.',
	})
	@ApiBaseResponse([QuizbookFindAllResponseDto], HttpStatus.OK, '조회 성공')
	async findAll(@Query() query: FindAllQuizbookDto) {
		return this.quizbookService.findAll(query);
	}

	// GET v1/quizbook/:quizbookId
	// 특정 문제집의 상세정보를 가져온다.
	@Get(':quizbookId')
	@ApiOperation({
		summary: '문제집 상세 조회',
		description: '문제집의 상세정보를 가져옵니다.',
	})
	@ApiExtraModels(Quiz)
	@ApiBaseResponse(QuizbookFindOneResponseDto, HttpStatus.OK, '조회 성공')
	async findOne(@Param('quizbookId') quizbookId: string) {
		return this.quizbookService.findOne(quizbookId);
	}
}
