import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { AuthTokenService } from '../auth/auth-token/auth-token.service';
import { Server, Socket } from 'socket.io';
import { AuthTokenPayloadDto } from '../auth/auth-token/dto/auth-token-payload.dto';
import { TokenType } from '../auth/auth-token/auth-token.types';
import { parse } from 'cookie';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

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
})
export class ChatGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(private readonly authTokenService: AuthTokenService) {}

	@WebSocketServer()
	server: Server;

	afterInit(server: Server) {
		console.log('Socket server initialized');
	}

	async handleConnection(client: AuthenticatedSocket) {
		try {
			const cookies: Record<string, string | undefined> = parse(
				client.handshake.headers.cookie || '',
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

			client.data.user = payload;
			console.log(`Socket connected : ${client.id}`);
			console.log('사용자:', payload.userId);
		} catch (err) {
			if (err instanceof Error) {
				client.emit('exception', { data: err.message });
			} else {
				client.emit('exception', {
					data: '알 수 없는 에러가 발생했습니다.',
				});
			}
			client.disconnect(true);
		}
	}

	handleDisconnect(client: Socket) {
		console.log(`Socket disconnected : ${client.id}`);
	}
}
