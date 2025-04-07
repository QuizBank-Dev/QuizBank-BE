import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBaseResponse } from 'src/common/decorators/base-response.decorator';
import { GroupChatsExample } from './chat.example';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { ChatQueryDto } from './dto/chat-query.dto';

@Controller({ path: 'chat', version: '1' })
@ApiTags('Chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get('group/:groupId')
	@ApiOperation({
		summary: '특정 Group의 채팅 내역 조회',
		description: '특정 Group의 채팅 내역을 조회합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '조회 성공', GroupChatsExample)
	getGroupChats(
		@UserId() userId: string,
		@Param('groupId') groupId: string,
		@Query() query: ChatQueryDto,
	) {
		return this.chatService.getGroupChats(userId, groupId, query);
	}
}
