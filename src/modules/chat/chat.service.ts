import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { ChatRepository } from './repository/chat.repository';
import { ChatQueryDto } from './dto/chat-query.dto';
import { ChatRoomRepository } from './repository/chat-room.repository';
import { toObjectId } from 'src/common/utils/database.util';
import { ReadStatusRepository } from './repository/read-status.repository';

@Injectable()
export class ChatService {
	constructor(
		private readonly chatRepository: ChatRepository,
		private readonly chatRoomRepository: ChatRoomRepository,
		private readonly readStatusRepository: ReadStatusRepository,
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

	async getGroupChatUnreadCount(userId: string, chatRoomId: string) {
		const chatRoom = await this.chatRoomRepository.findById(chatRoomId);

		if (!chatRoom)
			throw new NotFoundException(
				`해당 ${chatRoomId} ChatRoom을 찾을 수 없습니다.`,
			);

		if (!chatRoom.memberList.map((id) => id.toString()).includes(userId))
			throw new UnauthorizedException(`허가되지 않는 접근입니다.`);

		const readStatus = await this.readStatusRepository.findOne(
			toObjectId(userId),
			toObjectId(chatRoomId),
		);
		if (!readStatus)
			throw new NotFoundException(
				`해당 ${userId} 사용자의 ${chatRoomId} 그룹 채팅에 대한 ReadStatus를 찾을 수 없습니다.`,
			);

		const chatList = await this.chatRepository.findUnreadList(
			toObjectId(chatRoomId),
			readStatus.lastTimestamp,
		);

		return {
			count: chatList.length,
		};
	}
}
