import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envKeys } from 'src/config/env.const';
import { LoggerModule } from 'src/common/logger/logger.module';
import { Connection } from 'mongoose';
import { createLogger, Logger } from 'winston';
import { DB_TYPE } from './database.const';

@Module({
	imports: [
		LoggerModule,

		// Default DB 연결
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			connectionName: DB_TYPE.DEFAULT,
			useFactory: async (
				configService: ConfigService,
				logger: Logger,
			) => ({
				uri: configService.get<string>(envKeys.DB.DEFAULT_URI),
				onConnectionCreate: (connection: Connection) => {
					connection.on('connected', () =>
						logger.info('✅ Default DB Connected.'),
					);
					connection.on('error', (err) =>
						logger.error(`❌ Default DB Error: ${err}`),
					);
					connection.on('disconnected', () =>
						logger.warn('⚠️ Default DB Disconnected.'),
					);
					return connection;
				},
			}),
			inject: [ConfigService, 'winston'],
		}),

		// Sub DB 연결
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			connectionName: DB_TYPE.SUB,
			useFactory: async (
				configService: ConfigService,
				logger: Logger,
			) => ({
				uri: configService.get<string>(envKeys.DB.SUB_URI),
				onConnectionCreate: (connection: Connection) => {
					connection.on('connected', () =>
						logger.info('✅ Sub DB Connected.'),
					);
					connection.on('error', (err) =>
						logger.error(`❌ Sub DB Error: ${err}`),
					);
					connection.on('disconnected', () =>
						logger.warn('⚠️ Sub DB Disconnected.'),
					);
					return connection;
				},
			}),
			inject: [ConfigService, 'winston'],
		}),
	],
	exports: [MongooseModule],
})
export class DatabaseModule {}
