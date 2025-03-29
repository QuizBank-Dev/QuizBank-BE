import { Controller, Get, Param } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBaseResponse } from 'src/common/decorators/base-response.decorator';
import { quizBaseExample } from './quiz.example';

@Controller({
	path: 'quiz',
	version: '1',
})
@ApiTags('Quiz')
export class QuizController {
	constructor(private readonly quizService: QuizService) {}

	// GET v1/quiz/:quizId
	// 특정 Quiz를 가져온다.
	@Get(':quizId')
	@ApiOperation({
		summary: 'Quiz 조회',
		description: '특정 Quiz를 가져옵니다.',
	})
	@ApiBaseResponse(200, '조회 성공', quizBaseExample)
	getQuizById(@Param('quizId') quizId: string) {
		return this.quizService.getQuizDetail(quizId);
	}
}
