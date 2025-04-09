import { Request } from 'express';
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
			const provider = request.params.provider;
			try {
				const Guard = AuthGuard(provider);
				return (await new Guard().canActivate(context)) as boolean;
			} catch (error) {
				if (error instanceof Error) {
					this.logger.error(error.stack || error.message);
				}
				return false;
			}
		}
	}

	return mixin(MixinGuard);
}
