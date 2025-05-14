import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsException,
} from '@nestjs/websockets';
import { AuthTokenService } from '../auth/auth-token/auth-token.service';
import { Server, Socket } from 'socket.io';
import { AuthTokenPayloadDto } from '../auth/auth-token/dto/auth-token-payload.dto';
import { TokenType } from '../auth/auth-token/auth-token.types';
import { parse } from 'cookie';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateChatDto } from './dto/chat.dto';
import { ChatRepository } from './repository/chat.repository';
import { toObjectId } from 'src/common/utils/database.util';
import { ReadStatusRepository } from './repository/read-status.repository';
import { UserRepository } from '../user/user.repository';

interface AuthenticatedSocket extends Socket {
	data: {
		user: AuthTokenPayloadDto;
	};
}

@WebSocketGateway({
	cors: {
		origin: true,
		credentials: true,
	},
	namespace: 'chat',
})
export class ChatGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
		private readonly authTokenService: AuthTokenService,
		private readonly chatRepository: ChatRepository,
		private readonly readStatusRepository: ReadStatusRepository,
		private readonly userRepository: UserRepository,
	) {}

	@WebSocketServer()
	server: Server;

	afterInit(server: Server) {
		console.log('Socket server initialized');
	}

	async handleConnection(socket: AuthenticatedSocket) {
		try {
			const cookies: Record<string, string | undefined> = parse(
				socket.handshake.headers.cookie || '',
			);
			const accessToken = cookies['access_token'];

			if (!accessToken)
				throw new NotFoundException(
					'Access token not found in cookies',
				);

			const isBlacklisted =
				await this.authTokenService.isExpiredToken(accessToken);
			if (isBlacklisted)
				throw new UnauthorizedException(
					'인증정보가 올바르지 않습니다.',
				);

			const payload =
				this.authTokenService.verifyToken<AuthTokenPayloadDto>(
					TokenType.ACCESS,
					accessToken || '',
				);

			socket.data.user = payload;
			console.log(`Socket connected : ${socket.id}`);
			console.log('사용자:', payload.userId);
		} catch (err) {
			if (err instanceof Error) {
				socket.emit('exception', { data: err.message });
			} else {
				socket.emit('exception', {
					data: '알 수 없는 에러가 발생했습니다.',
				});
			}
			socket.disconnect(true);
		}
	}

	handleDisconnect(socket: Socket) {
		console.log(`Socket disconnected : ${socket.id}`);
	}

	@SubscribeMessage('enter_chat')
	async handleEnterChat(
		@ConnectedSocket() socket: AuthenticatedSocket,
		@MessageBody() chatRoomIds: string[],
	) {
		for (const chatRoomId of chatRoomIds) {
			await socket.join(chatRoomId);
		}
	}

	@SubscribeMessage('send_chat')
	async handleSendChat(
		@ConnectedSocket() socket: AuthenticatedSocket,
		@MessageBody()
		data: CreateChatDto,
	) {
		const { chatRoomId, content } = data;
		const userId = socket.data.user.userId;

		// 내 정보 조회
		const myInfo = await this.userRepository.findById(userId);
		if (!myInfo)
			throw new WsException(`해당 ${userId} 유저를 찾을 수 없습니다.`);

		// chat 생성 로직
		const newChat = await this.chatRepository.create({
			chatRoom: toObjectId(chatRoomId),
			sender: toObjectId(userId),
			content,
		});

		// readStatus 갱신 로직
		const now = new Date();
		await this.readStatusRepository.update(
			{ lastTimestamp: now },
			toObjectId(userId),
			toObjectId(chatRoomId),
		);

		socket.to(chatRoomId).emit('receive_chat', {
			_id: newChat._id,
			chatRoom: chatRoomId,
			sender: myInfo._id,
			content: content,
			createdAt: newChat.createdAt,
			updatedAt: newChat.updatedAt,
		});
	}
}
