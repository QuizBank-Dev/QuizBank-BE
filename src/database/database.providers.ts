import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import { envKeys } from 'src/config/env.const';
import { Logger } from 'winston';
import { DB_CONNECTIONS } from './database.const';

export const databaseProviders = [
	{
		provide: DB_CONNECTIONS.DEFAULT,
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
		provide: DB_CONNECTIONS.SUB,
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
