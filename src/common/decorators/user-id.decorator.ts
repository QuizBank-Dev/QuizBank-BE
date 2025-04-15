import {
	createParamDecorator,
	ExecutionContext,
	UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export const UserId = createParamDecorator(
	(optional: boolean = false, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<Request>();
		const userId = request?.user?.userId;

		if (!userId && !optional)
			throw new UnauthorizedException(
				'인증 정보가 유효하지 않거나 존재하지 않습니다.',
			);

		return userId;
	},
);
