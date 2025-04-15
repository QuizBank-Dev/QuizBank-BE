import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DB_TYPE } from 'src/database/database.const';
import { ClientSession, Model, Types } from 'mongoose';
import { Chat } from '../schema/chat.schema';

interface ChatQuery {
	chatRoom: Types.ObjectId;
	createdAt?: { $lt: Date };
}

@Injectable()
export class ChatRepository {
	constructor(
		@InjectModel(Chat.name, DB_TYPE.SUB)
		private readonly chatModel: Model<Chat>,
	) {}

	/**
	 * 채팅 내역 조회
	 */
	async findList(chatRoom: Types.ObjectId, cursor: Date, take: number) {
		const query: ChatQuery = { chatRoom };

		if (cursor) {
			query.createdAt = { $lt: cursor };
		}

		return this.chatModel
			.find(query)
			.sort({ createdAt: -1 })
			.limit(take)
			.populate([
				{
					path: 'sender',
					model: 'User',
					select: 'nickname profileImg',
				},
			]);
	}

	/**
	 * 채팅 내역 조회
	 */
	async findUnreadList(chatRoom: Types.ObjectId, date: Date) {
		return this.chatModel.find({ chatRoom, createdAt: { $gt: date } });
	}

	/**
	 * Chat 생성
	 */
	async create(data: Partial<Chat>, session?: ClientSession) {
		return new this.chatModel(data).save({ session });
	}

	/**
	 * Chat 삭제
	 */
	async delete(chatId: string, session?: ClientSession) {
		return this.chatModel.findByIdAndDelete(chatId, { session });
	}
}
