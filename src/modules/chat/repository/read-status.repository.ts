import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DB_TYPE } from 'src/database/database.const';
import { ClientSession, Model, Types } from 'mongoose';
import { ReadStatus } from '../schema/read-status.schema';

interface DeleteResult {
	acknowledged: boolean;
	deletedCount: number;
}

@Injectable()
export class ReadStatusRepository {
	constructor(
		@InjectModel(ReadStatus.name, DB_TYPE.DEFAULT)
		private readonly readStatusModel: Model<ReadStatus>,
	) {}

	/**
	 * 특정 그룹원의 ReadStatus 생성
	 */
	async create(data: Partial<ReadStatus>, session?: ClientSession) {
		return new this.readStatusModel(data).save({ session });
	}

	/**
	 * 특정 그룹원의 ReadStatus 갱신
	 */
	async update(
		data: Partial<ReadStatus>,
		userId: Types.ObjectId,
		chatRoomId: Types.ObjectId,
		session?: ClientSession,
	) {
		return this.readStatusModel.findOneAndUpdate(
			{ chatRoom: chatRoomId, member: userId },
			data,
			{
				session,
			},
		);
	}

	/**
	 * 특정 Group의 모든 ReadStatus 삭제
	 */
	async deleteAll(
		chatRoomId: Types.ObjectId,
		session?: ClientSession,
	): Promise<DeleteResult> {
		return this.readStatusModel.deleteMany(
			{ chatRoom: chatRoomId },
			{ session },
		);
	}

	/**
	 * 특정 그룹원의 ReadStatus 삭제
	 */
	async delete(userId: Types.ObjectId, session?: ClientSession) {
		return this.readStatusModel.findOneAndDelete(
			{ member: userId },
			{ session },
		);
	}
}
