import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/common/logger/logger.module';
import { databaseProviders } from './database.providers';

@Module({
	imports: [LoggerModule],
	providers: [...databaseProviders],
	exports: [...databaseProviders],
})
export class DatabaseModule {}
