import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DB_TYPE } from 'src/database/database.const';
import { Model } from 'mongoose';
import { Chat } from '../schema/chat.schema';

@Injectable()
export class ChatRepository {
	constructor(
		@InjectModel(Chat.name, DB_TYPE.SUB)
		private readonly chatModel: Model<Chat>,
	) {}
}
