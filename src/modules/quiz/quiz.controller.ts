import { Controller, Get, HttpStatus, Param, Version } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBaseResponse } from 'src/common/decorators/base-response.decorator';
import { Quiz } from './schema/quiz.schema';

@Controller('quiz')
@ApiTags('Quiz')
export class QuizController {
	constructor(private readonly quizService: QuizService) {}

	// GET v1/quiz/:id
	// 특정 Quiz를 가져온다.
	@Get(':id')
	@Version('1')
	@ApiOperation({
		summary: '퀴즈 조회',
		description: '특정 퀴즈를 가져옵니다.',
	})
	@ApiBaseResponse(Quiz, HttpStatus.OK, '조회 성공')
	findOne(@Param('id') id: string) {
		return this.quizService.findOne(id);
	}
}
