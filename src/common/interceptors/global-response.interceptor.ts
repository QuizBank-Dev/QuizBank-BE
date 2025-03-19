import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { BaseResponse } from '../dto/base-response.dto';

@Injectable()
export class GlobalResponseInterceptor<T>
	implements NestInterceptor<T, BaseResponse<T>>
{
	intercept(
		context: ExecutionContext,
		next: CallHandler<T>,
	): Observable<BaseResponse<T>> {
		const response = context.switchToHttp().getResponse<Response>();

		return next.handle().pipe(
			map((data: T) => {
				const statusCode = response.statusCode; // 기본값 200 OK

				return new BaseResponse(statusCode, 'ok', data);
			}),
		);
	}
}
