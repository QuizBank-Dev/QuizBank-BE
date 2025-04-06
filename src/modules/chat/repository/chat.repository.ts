import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DB_TYPE } from 'src/database/database.const';
import { ClientSession, Model, Types } from 'mongoose';
import { Chat } from '../schema/chat.schema';

interface DeleteResult {
	acknowledged: boolean;
	deletedCount: number;
}

@Injectable()
export class ChatRepository {
	constructor(
		@InjectModel(Chat.name, DB_TYPE.SUB)
		private readonly chatModel: Model<Chat>,
	) {}

	/**
	 * 특정 Group의 모든 Chat 삭제
	 */
	async deleteAll(
		chatRoomId: Types.ObjectId,
		session?: ClientSession,
	): Promise<DeleteResult> {
		return this.chatModel.deleteMany({ chatRoom: chatRoomId }, { session });
	}
}
