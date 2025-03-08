import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

interface ApiResponse<T> {
	statusCode: number;
	message: string;
	data: T;
}

@Injectable()
export class GlobalResponseInterceptor<T>
	implements NestInterceptor<T, ApiResponse<T>>
{
	intercept(
		context: ExecutionContext,
		next: CallHandler<T>,
	): Observable<ApiResponse<T>> {
		const response = context.switchToHttp().getResponse<Response>();

		return next.handle().pipe(
			map((data: T) => {
				if (response.statusCode >= 200 && response.statusCode < 300) {
					return {
						statusCode: response.statusCode,
						message: 'ok',
						data,
					};
				}

				return data as unknown as ApiResponse<T>; // ✅ 타입 강제 변환으로 오류 방지
			}),
		);
	}
}
