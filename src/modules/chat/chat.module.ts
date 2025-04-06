import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatRepository } from './repository/chat.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoom, ChatRoomSchema } from './schema/chat-room.schema';
import { DB_TYPE } from 'src/database/database.const';
import { Chat, ChatSchema } from './schema/chat.schema';
import { ReadStatus, ReadStatusSchema } from './schema/read-status.schema';
import { ChatRoomRepository } from './repository/chat-room.repository';
import { ReadStatusRepository } from './repository/read-status.repository';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: Chat.name, schema: ChatSchema }],
			DB_TYPE.SUB,
		),
		MongooseModule.forFeature(
			[
				{ name: ChatRoom.name, schema: ChatRoomSchema },
				{ name: ReadStatus.name, schema: ReadStatusSchema },
			],
			DB_TYPE.DEFAULT,
		),
	],
	controllers: [ChatController],
	providers: [
		ChatService,
		ChatRoomRepository,
		ChatRepository,
		ReadStatusRepository,
	],
	exports: [
		ChatService,
		ChatRoomRepository,
		ChatRepository,
		ReadStatusRepository,
	],
})
export class ChatModule {}
