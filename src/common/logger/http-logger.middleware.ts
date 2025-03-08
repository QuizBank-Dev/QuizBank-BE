import { Injectable, Inject } from '@nestjs/common';
import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
	constructor(@Inject('winston') private readonly logger: Logger) {}

	use(req: Request, res: Response, next: NextFunction) {
		const { method, originalUrl } = req;
		const start = Date.now();

		res.on('finish', () => {
			const { statusCode } = res;
			const responseTime = Date.now() - start;
			this.logger.info(
				`${method} ${originalUrl} ${statusCode} ${responseTime}ms`,
				{
					context: 'HTTP',
				},
			);
		});

		next();
	}
}
