import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { StudyService } from './study.service';
import { SubmitStudyDto } from './dto/submit-study.dto';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { ApiBaseResponse } from 'src/common/decorators/base-response.decorator';
import {
	getQuizbookRecordOfScoreListEx,
	getQuizRecordOfAnswerListEx,
	getQuizRecordOfAnswerListInGroupEx,
	getStudyResultEx,
} from './study.example';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetQuizRecordOfAnswerList } from './dto/get-quiz-record-of-answer-list.dto';

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

	// GET v1/study/quizbook/:quizbookId/result
	// Study 결과 조회
	@Get('quizbook/:quizbookId/result')
	@ApiOperation({
		summary: 'Quizbook에 대한 Study 결과 조회',
		description: '[학습 결과]에 사용될 StudyRecord 상세 조회',
	})
	@ApiBaseResponse(200, '조회 성공', getStudyResultEx)
	getStudyResult(
		@Param('quizbookId') quizbookId: string,
		@UserId() userId: string,
	) {
		return this.studyService.getStudyResult(quizbookId, userId);
	}

	// GET v1/study/quiz/:quizId/answer
	// 특정 Quiz에 대한 사용자들의 답안 조회
	@Get('quiz/:quizId/answer')
	@ApiResponse({
		status: 200,
		description: '조회 성공',
		content: {
			'application/json': {
				examples: {
					res_01: {
						summary: '일반 조회',
						value: {
							statusCode: 200,
							message: 'ok',
							result: getQuizRecordOfAnswerListEx,
						},
					},
					res_02: {
						summary: '그룹 조회',
						value: {
							statusCode: 200,
							message: 'ok',
							result: getQuizRecordOfAnswerListInGroupEx,
						},
					},
				},
			},
		},
	})
	@ApiOperation({
		summary: '사용자 답안 리스트 조회',
		description: '특정 Quiz에 대한 사용자가 작성한 답안 리스트 조회',
	})
	getQuizRecordOfAnswerList(
		@Param('quizId') quizId: string,
		@UserId() userId: string,
		@Query() dto: GetQuizRecordOfAnswerList,
	) {
		if (dto.groupId)
			return this.studyService.getQuizRecordOfAnswerListByGroup(
				quizId,
				dto.groupId,
				userId,
			);

		return this.studyService.getQuizRecordOfAnswerList(dto, quizId, userId);
	}

	// GET v1/study/quizbook/:quizbookId/score
	// 특정 Quizbook에 대한 Group 멤버들의 점수 조회
	@Get('quizbook/:quizbookId/score')
	@ApiOperation({
		summary: '그룹 멤버별 점수 조회',
		description: '특정 Quizbook에 대한 그룹 멤버들의 점수 조회',
	})
	@ApiBaseResponse(200, '조회 성공', getQuizbookRecordOfScoreListEx)
	getQuizbookRecordOfScoreList(
		@Param('quizbookId') quizbookId: string,
		@Query('groupId') groupId: string,
		@UserId() userId: string,
	) {
		return this.studyService.getQuizRecordOfScoreListByGroup(
			quizbookId,
			groupId,
			userId,
		);
	}
}
