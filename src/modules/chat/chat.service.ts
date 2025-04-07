import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { ChatRepository } from './repository/chat.repository';
import { ChatQueryDto } from './dto/chat-query.dto';
import { ChatRoomRepository } from './repository/chat-room.repository';
import { toObjectId } from 'src/common/utils/database.util';

@Injectable()
export class ChatService {
	constructor(
		private readonly chatRepository: ChatRepository,
		private readonly chatRoomRepository: ChatRoomRepository,
	) {}

	async getGroupChats(
		userId: string,
		chatRoomId: string,
		query: ChatQueryDto,
	) {
		const chatRoom = await this.chatRoomRepository.findById(chatRoomId);

		if (!chatRoom)
			throw new NotFoundException(
				`해당 ${chatRoomId} ChatRoom을 찾을 수 없습니다.`,
			);

		if (!chatRoom.memberList.map((id) => id.toString()).includes(userId))
			throw new UnauthorizedException(`허가되지 않는 접근입니다.`);

		const { cursor, take } = query;
		const chats = await this.chatRepository.findList(
			toObjectId(chatRoomId),
			cursor ? new Date(cursor) : new Date(),
			Number(take),
		);

		return {
			chats,
			nextCursor: chats.length > 0 ? chats[0].createdAt : null,
		};
	}
}
