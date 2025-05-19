import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GroupQuizbook } from './schema/group-quizbook.schema';
import { DB_TYPE } from 'src/database/database.const';
import { ClientSession, FilterQuery, Model, Types } from 'mongoose';
import { toObjectId } from 'src/common/utils/database.util';

interface GroupQuizbookListQuery {
	group: Types.ObjectId;
	endedAt?: { $lt?: Date; $gt?: Date };
}

@Injectable()
export class GroupQuizbookRepository {
	constructor(
		@InjectModel(GroupQuizbook.name, DB_TYPE.DEFAULT)
		private readonly groupQuizbookModel: Model<GroupQuizbook>,
	) {}

	/**
	 * 특정 Group의 선정 문제집 카드 정보 목록 조회
	 */
	async findGroupQuizbookList(
		group: Types.ObjectId,
		standard: Date,
		limit: number,
		status: string,
		sort: string,
		cursor?: Date,
	) {
		const query: GroupQuizbookListQuery = { group };

		if (status === 'in-progress') {
			query.endedAt = { $gt: standard };
			if (cursor) {
				if (sort === 'increase') {
					query.endedAt.$gt = cursor;
				} else {
					query.endedAt.$lt = cursor;
				}
			}
		} else {
			query.endedAt = { $lt: standard };
			if (cursor) {
				if (sort === 'increase') {
					query.endedAt.$gt = cursor;
				} else {
					query.endedAt.$lt = cursor;
				}
			}
		}

		return this.groupQuizbookModel
			.find(query)
			.sort({ endedAt: sort === 'increase' ? 1 : -1 })
			.limit(limit)
			.populate([
				{
					path: 'quizbook',
					model: 'Quizbook',
					populate: {
						path: 'author',
						model: 'User',
						select: 'nickname profileImg',
					},
				},
			]);
	}

	/**
	 * 특정 Group의 선정 문제집 전체 개수 동기화를 위한 남은 개수 조회
	 */
	async findLeftCount(
		group: Types.ObjectId,
		standard: Date,
		status: string,
		sort: string,
		cursor?: Date,
	) {
		const query: GroupQuizbookListQuery = { group };

		if (status === 'in-progress') {
			query.endedAt = { $gt: standard };
			if (cursor) {
				if (sort === 'increase') {
					query.endedAt.$gt = cursor;
				} else {
					query.endedAt.$lt = cursor;
				}
			}
		} else {
			query.endedAt = { $lt: standard };
			if (cursor) {
				if (sort === 'increase') {
					query.endedAt.$gt = cursor;
				} else {
					query.endedAt.$lt = cursor;
				}
			}
		}

		return this.groupQuizbookModel.countDocuments(query);
	}

	/**
	 * GroupQuizbook 생성
	 */
	async create(data: Partial<GroupQuizbook>, session?: ClientSession) {
		return new this.groupQuizbookModel(data).save({ session });
	}

	/**
	 * 특정 GroupQuizbook 정보 수정
	 */
	async update(
		data: Partial<GroupQuizbook> | FilterQuery<GroupQuizbook>,
		groupId: string,
		quizbookId: string,
		session?: ClientSession,
	) {
		return this.groupQuizbookModel.findOneAndUpdate(
			{ group: toObjectId(groupId), quizbook: toObjectId(quizbookId) },
			data,
			{ session },
		);
	}

	/**
	 * GroupQuizbook 삭제 with filter
	 */
	async delete(groupId: string, quizbookId: string, session?: ClientSession) {
		return this.groupQuizbookModel.findOneAndDelete(
			{ group: toObjectId(groupId), quizbook: toObjectId(quizbookId) },
			{ session },
		);
	}

	/**
	 * GroupQuizbook 삭제 by Id
	 */
	async deleteById(groupQuizbookId: string, session?: ClientSession) {
		return this.groupQuizbookModel.findByIdAndDelete(groupQuizbookId, {
			session,
		});
	}
}
