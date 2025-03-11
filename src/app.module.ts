import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { HttpLoggerMiddleware } from './common/logger/http-logger.middleware';
import { LoggerModule } from './common/logger/logger.module';
import { DatabaseModule } from './database/database.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { QuizbookModule } from './modules/quizbook/quizbook.module';
import { CommentModule } from './modules/comment/comment.module';
import { ReviewModule } from './modules/review/review.module';

@Module({
	imports: [ConfigModule, LoggerModule, DatabaseModule, QuizModule, QuizbookModule, CommentModule, ReviewModule],
	providers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(HttpLoggerMiddleware).forRoutes('*');
	}
}
