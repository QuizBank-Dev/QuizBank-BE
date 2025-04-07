import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DB_TYPE } from 'src/database/database.const';
import { Model } from 'mongoose';
import { Chat } from '../schema/chat.schema';

interface ChatQuery {
	chatRoom: string;
	createdAt?: { $lt: Date };
}

@Injectable()
export class ChatRepository {
	constructor(
		@InjectModel(Chat.name, DB_TYPE.SUB)
		private readonly chatModel: Model<Chat>,
	) {}

	async findList(chatRoom: string, cursor: Date, take: number) {
		const query: ChatQuery = { chatRoom };

		if (cursor) {
			query.createdAt = { $lt: cursor };
		}

		return this.chatModel
			.find(query)
			.sort({ createdAt: 1 })
			.limit(take)
			.populate([
				{
					path: 'sender',
					model: 'User',
					select: 'nickname profileImg',
				},
			]);
	}
}
