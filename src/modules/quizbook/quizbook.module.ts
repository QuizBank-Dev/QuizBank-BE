import { Module } from '@nestjs/common';
import { QuizbookService } from './quizbook.service';
import { QuizbookController } from './quizbook.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Quizbook, QuizbookSchema } from './schema/quizbook.schema';
import { Quiz, QuizSchema } from '../quiz/schema/quiz.schema';
import { DB_TYPE } from 'src/database/database.const';
import { QuizbookRepository } from './quizbook.repository';

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{ name: Quizbook.name, schema: QuizbookSchema },
				{ name: Quiz.name, schema: QuizSchema },
			],
			DB_TYPE.DEFAULT,
		),
	],
	controllers: [QuizbookController],
	providers: [QuizbookService, QuizbookRepository],
	exports: [QuizbookService, QuizbookRepository],
})
export class QuizbookModule {}
