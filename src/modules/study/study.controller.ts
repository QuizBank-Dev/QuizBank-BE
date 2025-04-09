import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StudyService } from './study.service';
import { SubmitStudyDto } from './dto/submit-study.dto';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { ApiBaseResponse } from 'src/common/decorators/base-response.decorator';
import { getStudyResultExample } from './study.example';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({
	path: 'study',
	version: '1',
})
@ApiTags('Study')
export class StudyController {
	constructor(private readonly studyService: StudyService) {}

	// POST v1/study
	// 사용자 답안 제출
	@Post()
	@ApiOperation({
		summary: '사용자 답안 제출',
		description: 'Quizbook에 대한 사용자의 답안을 제출합니다.',
	})
	@ApiBaseResponse(201, '제출 성공')
	submitStudy(@Body() dto: SubmitStudyDto, @UserId() userId: string) {
		return this.studyService.submitStudy(dto, userId);
	}

	// GET v1/study/result?quizbookId
	// Study 결과 조회
	@Get('result')
	@ApiOperation({
		summary: 'Quizbook에 대한 Study 결과 조회',
		description: 'Quizbook에 대한 Study 결과를 조회합니다.',
	})
	@ApiBaseResponse(200, '조회 성공', getStudyResultExample)
	getStudyResult(
		@Query('quizbookId') quizbookId: string,
		@UserId() userId: string,
	) {
		return this.studyService.getStudyResult(quizbookId, userId);
	}
}
