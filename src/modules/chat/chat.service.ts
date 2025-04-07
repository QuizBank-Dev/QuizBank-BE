import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { ChatRepository } from './repository/chat.repository';
import { ChatQueryDto } from './dto/chat-query.dto';
import { GroupRepository } from '../group/group.repository';

@Injectable()
export class ChatService {
	constructor(
		private readonly chatRepository: ChatRepository,
		private readonly groupRepository: GroupRepository,
	) {}

	async getGroupChats(userId: string, groupId: string, query: ChatQueryDto) {
		const group = await this.groupRepository.findById(groupId);

		if (!group)
			throw new NotFoundException(
				`해당 ${groupId} Group을 찾을 수 없습니다.`,
			);

		if (
			!group.memberList
				.map((user) => user._id.toString())
				.includes(userId)
		)
			throw new UnauthorizedException(`허가되지 않는 접근입니다.`);

		const { cursor, take } = query;
		const chats = await this.chatRepository.findList(
			group.chatRoom.toString(),
			cursor ? new Date(cursor) : new Date(),
			Number(take),
		);

		return {
			chats,
			nextCursor: chats.length > 0 ? chats[0].createdAt : null,
		};
	}
}
