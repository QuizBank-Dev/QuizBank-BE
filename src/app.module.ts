import { APP_GUARD } from '@nestjs/core';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { HttpLoggerMiddleware } from './common/logger/http-logger.middleware';
import { LoggerModule } from './common/logger/logger.module';
import { DatabaseModule } from './database/database.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { QuizbookModule } from './modules/quizbook/quizbook.module';
import { ReviewModule } from './modules/review/review.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AuthGuard } from './modules/auth/guard/auth.guard';
import { RefreshTokenMiddleware } from './modules/auth/middleware/refresh-token.middleware';
import { GroupModule } from './modules/group/group.module';
import { CommentModlue } from './modules/comment/comment.module';
import { GroupQuizbookModule } from './modules/group/group-quizbook/group-quizbook.module';
import { UploadModule } from './modules/upload/upload.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
	imports: [
		ConfigModule,
		LoggerModule,
		DatabaseModule,
		QuizModule,
		QuizbookModule,
		ReviewModule,
		MailerModule,
		AuthModule,
		UserModule,
		GroupModule,
		CommentModlue,
		GroupQuizbookModule,
		UploadModule,
		CategoryModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(HttpLoggerMiddleware).forRoutes('*');
		consumer.apply(RefreshTokenMiddleware).forRoutes('*');
	}
}
