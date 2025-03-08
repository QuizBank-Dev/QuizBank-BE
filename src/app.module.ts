import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { HttpLoggerMiddleware } from './common/logger/http-logger.middleware';
import { LoggerModule } from './common/logger/logger.module';
import { DatabaseModule } from './database/database.module';

@Module({
	imports: [ConfigModule, LoggerModule, DatabaseModule],
	providers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(HttpLoggerMiddleware).forRoutes('*');
	}
}
