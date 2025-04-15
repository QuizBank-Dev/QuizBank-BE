import { Request, Response } from 'express';
import { Logger } from 'winston';
import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	mixin,
	Type,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * request로 받은 provider 값으로 AuthGuard 클래스를 리턴하는 함수
 */
export function DynamicAuthGuard(): Type<CanActivate> {
	@Injectable()
	class MixinGuard extends AuthGuard('entry') {
		constructor(@Inject('winston') private readonly logger: Logger) {
			super();
		}

		async canActivate(context: ExecutionContext) {
			const request: Request = context.switchToHttp().getRequest();
			const response: Response = context.switchToHttp().getResponse();
			const provider = request.params.provider;
			const redirect = request.query.redirect;

			if (redirect) {
				// redirectUrl 있는 경우 쿠키에 추가
				response.cookie('redirect', redirect, {
					httpOnly: true,
					maxAge: 1000 * 60 * 5,
				});
			}

			try {
				const Guard = AuthGuard(provider);
				return (await new Guard().canActivate(context)) as boolean;
			} catch (error) {
				if (error instanceof Error) {
					this.logger.error(error.stack || error.message);
				}
				response.clearCookie('redirect');
				return false;
			}
		}
	}

	return mixin(MixinGuard);
}
