import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_TYPE } from 'src/database/database.const';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { LikeRepository } from './like.repository';
import {
	QuizbookLike,
	QuizbookLikeSchema,
} from './schema/quizbook-like.schema';
import { QuizLike, QuizLikeSchema } from './schema/quiz-like.schema';
import { QuizbookModule } from '../quizbook/quizbook.module';
import { QuizModule } from '../quiz/quiz.module';

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{ name: QuizbookLike.name, schema: QuizbookLikeSchema },
				{ name: QuizLike.name, schema: QuizLikeSchema },
			],
			DB_TYPE.DEFAULT,
		),
		forwardRef(() => QuizbookModule),
		forwardRef(() => QuizModule),
	],
	controllers: [LikeController],
	providers: [LikeService, LikeRepository],
	exports: [LikeService, LikeRepository],
})
export class LikeModule {}
