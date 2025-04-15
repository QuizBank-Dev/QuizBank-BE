import {
	Controller,
	Get,
	HttpStatus,
	Param,
	Patch,
	Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBaseResponse } from 'src/common/decorators/base-response.decorator';
import { ChatsExample, UnreadCountExample } from './chat.example';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { ChatQueryDto } from './dto/chat-query.dto';

@Controller({ path: 'chat', version: '1' })
@ApiTags('Chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get(':chatRoomId')
	@ApiOperation({
		summary: '채팅 내역 조회',
		description: '채팅 내역을 조회합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '조회 성공', ChatsExample)
	getGroupChats(
		@UserId() userId: string,
		@Param('chatRoomId') chatRoomId: string,
		@Query() query: ChatQueryDto,
	) {
		return this.chatService.getGroupChats(userId, chatRoomId, query);
	}

	@Get(':chatRoomId/unread-count')
	@ApiOperation({
		summary: '그룹 채팅 안읽은 메세지 개수 조회',
		description: '그룹 채팅 안읽은 메세지 개수를 조회합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '조회 성공', UnreadCountExample)
	getGroupChatUnreadCount(
		@UserId() userId: string,
		@Param('chatRoomId') chatRoomId: string,
	) {
		return this.chatService.getGroupChatUnreadCount(userId, chatRoomId);
	}

	@Patch(':chatRoomId/read')
	@ApiOperation({
		summary: '채팅 읽음 처리',
		description:
			'특정 ChatRoom에 대한 사용자의 ReadStatus를 최신으로 갱신합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '갱신 성공')
	async patchReadStatus(
		@UserId() userId: string,
		@Param('chatRoomId') chatRoomId: string,
	) {
		await this.chatService.patchReadStatus(userId, chatRoomId);
	}
}
