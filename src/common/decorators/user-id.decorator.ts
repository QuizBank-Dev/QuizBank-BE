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
			throw new UnauthorizedException(
				'인증 정보가 유효하지 않거나 존재하지 않습니다.',
			);

		return request.user.userId;
	},
);
