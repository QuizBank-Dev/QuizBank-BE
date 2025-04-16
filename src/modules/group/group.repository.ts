import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './schema/group.schema';
import { ClientSession, FilterQuery, Model, Types } from 'mongoose';
import { DB_TYPE } from 'src/database/database.const';
import { GroupQueryDto } from './dto/group-query.dto';
import { toObjectId } from 'src/common/utils/database.util';

interface GroupQuery {
	cursor?: { $lt: Types.ObjectId };
	memberList?: { $in: [Types.ObjectId] };
	name?: { $regex: string; $options: string };
}

@Injectable()
export class GroupRepository {
	constructor(
		@InjectModel(Group.name, DB_TYPE.DEFAULT)
		private readonly groupModel: Model<Group>,
	) {}

	/**
	 * Group 목록 조회
	 */
	async findGroupList(memberId: Types.ObjectId, query: GroupQueryDto) {
		const { cursor, limit, is_mine, name } = query;

		const filter: GroupQuery = {};

		if (cursor) filter.cursor = { $lt: toObjectId(cursor) };
		if (is_mine) filter.memberList = { $in: [memberId] };
		if (name) filter.name = { $regex: name, $options: 'i' };

		return this.groupModel
			.find(filter)
			.sort({ _id: -1 })
			.limit(limit)
			.populate([
				{
					path: 'admin',
					model: 'User',
					select: 'nickname profileImg',
				},
			]);
	}

	/**
	 * Group 전체 개수 동기화를 위한 남은 개수 조회
	 */
	async findLeftCount(memberId: Types.ObjectId, query: GroupQueryDto) {
		const { cursor, is_mine, name } = query;

		const filter: GroupQuery = {};

		if (cursor) filter.cursor = { $lt: toObjectId(cursor) };
		if (is_mine) filter.memberList = { $in: [memberId] };
		if (name) filter.name = { $regex: name, $options: 'i' };

		return this.groupModel.countDocuments(filter);
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
				path: 'applyingUserList',
				model: 'User',
				select: 'nickname profileImg email',
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

	/**
	 * Group 조회
	 */
	async findOneById(groupId: string, userId: string) {
		return await this.groupModel
			.findOne({
				_id: groupId,
				memberList: { $in: [toObjectId(userId)] },
			})
			.lean();
	}
}
