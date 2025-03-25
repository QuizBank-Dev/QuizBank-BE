import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Public } from '../decorator/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const isPublic = this.reflector.get(Public, context.getHandler());

		if (isPublic) {
			return true;
		}

		const request: Request = context.switchToHttp().getRequest();

		if (request.user) {
			return true;
		}

		throw new UnauthorizedException('인증정보가 올바르지 않습니다.');
	}
}
