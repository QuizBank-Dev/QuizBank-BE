import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DB_TYPE } from 'src/database/database.const';
import { ClientSession, Model } from 'mongoose';
import { ReadStatus } from '../schema/read-status.schema';

@Injectable()
export class ReadStatusRepository {
	constructor(
		@InjectModel(ReadStatus.name, DB_TYPE.SUB)
		private readonly readStatusModel: Model<ReadStatus>,
	) {}

	/**
	 * 특정 그룹원의 ReadStatus 생성
	 */
	async create(data: Partial<ReadStatus>, session?: ClientSession) {
		return new this.readStatusModel(data).save({ session });
	}
}
