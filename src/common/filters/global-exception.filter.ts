import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		let message: string;
		if (exception instanceof HttpException) {
			const resBody = exception.getResponse();
			if (
				typeof resBody === 'object' &&
				resBody !== null &&
				'message' in resBody
			) {
				const msg = (resBody as { message?: string | string[] })
					.message;
				message =
					typeof msg === 'string'
						? msg
						: Array.isArray(msg)
							? msg.join(', ')
							: '';
			} else if (typeof resBody === 'string') {
				message = resBody;
			} else {
				message = '오류가 발생했습니다.';
			}
		} else {
			message = 'Internal server error';
		}

		response.status(status).json({
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
			message,
		});
	}
}
