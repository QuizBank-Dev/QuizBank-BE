import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DB_TYPE } from 'src/database/database.const';
import { ChatRoom } from '../schema/chat-room.schema';
import { ClientSession, Model, Types } from 'mongoose';

@Injectable()
export class ChatRoomRepository {
	constructor(
		@InjectModel(ChatRoom.name, DB_TYPE.SUB)
		private readonly chatRoomModel: Model<ChatRoom>,
	) {}

	/**
	 * 특정 Group의 ChatRoom 생성
	 */
	async create(data: Partial<ChatRoom>, session?: ClientSession) {
		return new this.chatRoomModel(data).save({ session });
	}

	/**
	 * 특정 Group의 ChatRoom 삭제
	 */
	async delete(chatRoomId: Types.ObjectId, session?: ClientSession) {
		return this.chatRoomModel.findByIdAndDelete(chatRoomId, { session });
	}
}
