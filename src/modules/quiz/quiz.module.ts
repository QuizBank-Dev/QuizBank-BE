import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from './schema/quiz.schema';
import { DB_TYPE } from 'src/database/database.const';
import { QuizRepository } from './quiz.repository';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: Quiz.name, schema: QuizSchema }],
			DB_TYPE.DEFAULT,
		),
	],
	controllers: [QuizController],
	providers: [QuizService, QuizRepository],
	exports: [QuizService, QuizRepository],
})
export class QuizModule {}
