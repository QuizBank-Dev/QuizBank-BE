import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './schema/group.schema';
import { ClientSession, FilterQuery, Model } from 'mongoose';
import { DB_TYPE } from 'src/database/database.const';

@Injectable()
export class GroupRepository {
	constructor(
		@InjectModel(Group.name, DB_TYPE.DEFAULT)
		private readonly groupModel: Model<Group>,
	) {}

	/**
	 * 내가 속한 Group 목록 조회
	 */
	async findAllBelongedGroupById(memberId: string) {
		return this.groupModel.find({ memberList: memberId }).populate([
			{
				path: 'admin',
				model: 'User',
				select: 'nickname profileImg',
			},
			{
				path: 'groupQuizbookList',
				model: 'GroupQuizbook',
				select: 'quizbook endedAt',
			},
		]);
	}

	/**
	 * 특정 Group 상세 정보 조회
	 */
	async findById(groupId: string) {
		return this.groupModel.findById(groupId).populate([
			{
				path: 'admin',
				model: 'User',
				select: 'nickname profileImg',
			},
			{
				path: 'memberList',
				model: 'User',
				select: 'nickname profileImg email',
			},
			{
				path: 'groupQuizbookList',
				model: 'GroupQuizbook',
				select: 'quizbook endedAt',
			},
		]);
	}

	/**
	 * Group 생성
	 */
	async create(data: Partial<Group>, session?: ClientSession) {
		return new this.groupModel(data).save({ session });
	}

	/**
	 * Group 정보 수정
	 */
	async update(
		data: Partial<Group> | FilterQuery<Group>,
		groupId: string,
		session?: ClientSession,
	) {
		return this.groupModel.findByIdAndUpdate(groupId, data, { session });
	}

	/**
	 * Group 삭제
	 */
	async delete(groupId: string, session?: ClientSession) {
		return this.groupModel.findByIdAndDelete(groupId, { session });
	}
}
