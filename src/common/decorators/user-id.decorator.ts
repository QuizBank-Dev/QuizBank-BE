import {
	createParamDecorator,
	ExecutionContext,
	UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export const UserId = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<Request>();

		if (!request || !request.user || !request.user.userId)
			throw new UnauthorizedException('사용자 정보를 찾을 수 없습니다.');

		return request.user.userId;
	},
);
