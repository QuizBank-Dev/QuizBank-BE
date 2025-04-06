import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DB_TYPE } from 'src/database/database.const';
import { ChatRoom } from '../schema/chat-room.schema';
import { Model } from 'mongoose';

@Injectable()
export class ChatRoomRepository {
	constructor(
		@InjectModel(ChatRoom.name, DB_TYPE.SUB)
		private readonly chatRoomModel: Model<ChatRoom>,
	) {}
}
