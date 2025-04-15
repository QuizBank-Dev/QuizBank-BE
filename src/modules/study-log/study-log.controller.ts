import { Controller, Get, Query } from '@nestjs/common';
import { StudyLogService } from './study-log.service';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { getStudyLogDto } from './dto/get-study-log.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBaseResponse } from 'src/common/decorators/base-response.decorator';
import { studyLogEx } from './study-log.example';

@Controller({
	path: 'study-log',
	version: '1',
})
@ApiTags('StudyLog')
export class StudyLogController {
	constructor(private readonly studyLogService: StudyLogService) {}
	// GET v1/studyLog/weekly
	// 사용자의 주간 StudyLog를 가져옵니다.
	@Get('weekly')
	@ApiOperation({
		summary: '특정 사용자의 주간학습 기록 조회',
		description: '현재 날짜 기준 주간학습 기록을 조회',
	})
	@ApiBaseResponse(200, '조회 성공', studyLogEx)
	async getWeeklyStudyLog(
		@UserId() userId: string,
		@Query() dto: getStudyLogDto,
	) {
		return this.studyLogService.findWeeklyStudyLogByUser(
			dto.userId ? dto.userId : userId,
			dto.offset,
		);
	}

	// GET v1/studyLog/yearly
	// 사용자의 연간 StudyLog를 가져옵니다.
	@Get('yearly')
	@ApiOperation({
		summary: '특정 사용자의 연간학습 기록 조회',
		description: '현재 년도 기준 연간학습 기록을 조회',
	})
	@ApiBaseResponse(200, '조회 성공', studyLogEx)
	async getYearlyStuyLog(
		@UserId() userId: string,
		@Query() dto: getStudyLogDto,
	) {
		return this.studyLogService.findYearlyStuyLogByUser(
			dto.userId ? dto.userId : userId,
			dto.offset,
		);
	}
}
