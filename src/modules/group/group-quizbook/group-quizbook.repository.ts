import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GroupQuizbook } from './schema/group-quizbook.schema';
import { DB_TYPE } from 'src/database/database.const';
import { ClientSession, Model } from 'mongoose';

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
		return this.groupQuizbookModel.find({ group: groupId }).populate([
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
}
