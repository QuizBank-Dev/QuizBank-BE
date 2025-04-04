import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GroupQuizbook } from './schema/group-quizbook.schema';
import { DB_TYPE } from 'src/database/database.const';
import { ClientSession, FilterQuery, Model } from 'mongoose';
import { toObjectId } from 'src/common/utils/database.util';

@Injectable()
export class GroupQuizbookRepository {
	constructor(
		@InjectModel(GroupQuizbook.name, DB_TYPE.DEFAULT)
		private readonly groupQuizbookModel: Model<GroupQuizbook>,
	) {}

	/**
	 * 특정 Group의 선정 문제집 카드 정보 목록 조회
	 */
	async findAllGroupQuizbook(groupId: string) {
		return this.groupQuizbookModel
			.find({ group: toObjectId(groupId) })
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
