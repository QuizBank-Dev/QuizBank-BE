import { Injectable } from '@nestjs/common';
import { StudyLogRepository } from './study-log.repository';

@Injectable()
export class StudyLogService {
	constructor(private readonly studyLogRepo: StudyLogRepository) {}

	// 사용자의 주간 StudyLog 조회
	async findWeeklyStudyLogByUser(userId: string, offset: number = 0) {
		return this.studyLogRepo.findWeekly(userId, offset);
	}

	// 사용자의 연간 StudyLog 조회
	async findYearlyStuyLogByUser(userId: string, offset: number = 0) {
		return this.studyLogRepo.findYearly(userId, offset);
	}
}
