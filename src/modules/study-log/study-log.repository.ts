import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DB_TYPE } from 'src/database/database.const';
import { Model } from 'mongoose';
import * as moment from 'moment-timezone';
import { toObjectId } from 'src/common/utils/database.util';
import { StudyLog } from './schema/study-log.schema';

@Injectable()
export class StudyLogRepository {
	constructor(
		@InjectModel(StudyLog.name, DB_TYPE.DEFAULT)
		private readonly studyLogModel: Model<StudyLog>,
	) {}

	/**
	 * StudyLog 생성 또는 업데이트
	 */
	async upsert(solvedCount: number, userId: string) {
		const today = moment().tz('Asia/Seoul').format('YYYY-MM-DD');

		return this.studyLogModel.updateOne(
			{ owner: toObjectId(userId), date: today },
			{
				$inc: { solvedCount },
				$setOnInsert: { createdAt: new Date() },
			},
			{ upsert: true, new: true },
		);
	}

	/**
	 * 주간 StudyLog 조회
	 * (N주 전까지 가능)
	 */
	async findWeekly(userId: string, weekOffset: number = 0) {
		const base = moment().tz('Asia/Seoul');

		const start = base
			.clone()
			.startOf('isoWeek')
			.subtract(weekOffset, 'weeks')
			.format('YYYY-MM-DD');
		const end = base
			.clone()
			.startOf('isoWeek')
			.subtract(weekOffset, 'weeks')
			.add(6, 'days')
			.format('YYYY-MM-DD');

		return this.studyLogModel
			.find({
				owner: toObjectId(userId),
				date: { $gte: start, $lte: end },
			})
			.select('-_id date solvedCount')
			.sort({ date: 1 })
			.lean();
	}

	/**
	 * 연간 StduyLog 조회
	 * (N년 전까지 가능)
	 */
	async findYearly(userId: string, weekOffset: number = 0) {
		const base = moment().tz('Asia/Seoul').year();

		const start = `${base - weekOffset}-01-01`;
		const end = `${base - weekOffset}-12-31`;

		return this.studyLogModel
			.find({
				owner: toObjectId(userId),
				date: { $gte: start, $lte: end },
			})
			.select('-_id date solvedCount')
			.sort({ date: 1 })
			.lean();
	}

	/**
	 * 특정 user의 study log 제거
	 * @param userId
	 */
	async deleteLog(userId: string) {
		await this.studyLogModel.deleteMany({ owner: toObjectId(userId) });
	}
}
