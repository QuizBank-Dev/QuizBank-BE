import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import { envKeys } from 'src/config/env.const';
import { Logger } from 'winston';

export const databaseProviders = [
	{
		provide: envKeys.DB.DEFAULT_URI,
		useFactory: (configService: ConfigService, logger: Logger) => {
			const uri = configService.get<string>(envKeys.DB.DEFAULT_URI)!;
			const connection = mongoose.createConnection(uri);
			connection.on('connected', () => {
				logger.info('✅ Default DB connected successfully.', {
					context: 'Database',
				});
			});
			connection.on('error', (err) => {
				logger.error(`❌ Default DB connection error: ${err}`, {
					context: 'Database',
				});
			});
			connection.on('disconnected', () => {
				logger.warn('❌ Default DB disconnected.', {
					context: 'Database',
				});
			});

			return connection;
		},
		inject: [ConfigService, 'winston'],
	},
	{
		provide: envKeys.DB.SUB_URI,
		useFactory: (configService: ConfigService, logger: Logger) => {
			const uri = configService.get<string>(envKeys.DB.SUB_URI)!;
			const connection = mongoose.createConnection(uri);
			connection.on('connected', () => {
				logger.info('✅ Sub DB connected successfully.', {
					context: 'Database',
				});
			});
			connection.on('error', (err) => {
				logger.error(`❌ Sub MongoDB connection error: ${err}`, {
					context: 'Database',
				});
			});
			connection.on('disconnected', () => {
				logger.warn('❌ Sub DB disconnected.', { context: 'Database' });
			});

			return connection;
		},
		inject: [ConfigService, 'winston'],
	},
];
