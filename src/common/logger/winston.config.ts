import * as winston from 'winston';

interface CustomLogInfo extends winston.Logform.TransformableInfo {
	timestamp: string;
	message: string;
	context?: string;
}

export const winstonConfig = {
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				winston.format.printf(
					({ timestamp, level, message, context }: CustomLogInfo) => {
						return `[${timestamp}] [${level}]${context ? ' [' + context + ']' : ''}: ${message}`;
					},
				),
			),
		}),
	],
};
