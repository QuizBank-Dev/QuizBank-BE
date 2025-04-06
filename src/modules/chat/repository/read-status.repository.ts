import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DB_TYPE } from 'src/database/database.const';
import { Model } from 'mongoose';
import { ReadStatus } from '../schema/read-status.schema';

@Injectable()
export class ReadStatusRepository {
	constructor(
		@InjectModel(ReadStatus.name, DB_TYPE.SUB)
		private readonly readStatusModel: Model<ReadStatus>,
	) {}
}
