import { forwardRef, Module } from '@nestjs/common';
import { StudyController } from './study.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_TYPE } from 'src/database/database.const';
import {
	QuizbookRecord,
	QuizbookRecordSchema,
} from './schema/quizbook-record.schema';
import { QuizRecord, QuizRecordSchema } from './schema/quiz-record.schema';
import { StudyService } from './study.service';
import { StudyRepository } from './study.repository';
import { QuizbookModule } from '../quizbook/quizbook.module';
import { DatabaseModule } from 'src/database/database.module';
import { LikeModule } from '../like/like.module';
import { StudyLogModule } from '../study-log/study-log.module';
import { GroupModule } from '../group/group.module';
import { AIModule } from '../ai/ai.module';
import { QuizModule } from '../quiz/quiz.module';

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{ name: QuizbookRecord.name, schema: QuizbookRecordSchema },
				{ name: QuizRecord.name, schema: QuizRecordSchema },
			],
			DB_TYPE.DEFAULT,
		),
		forwardRef(() => QuizModule),
		forwardRef(() => QuizbookModule),
		forwardRef(() => LikeModule),
		forwardRef(() => StudyLogModule),
		forwardRef(() => GroupModule),
		forwardRef(() => AIModule),
		DatabaseModule,
	],
	controllers: [StudyController],
	providers: [StudyService, StudyRepository],
	exports: [StudyService, StudyRepository],
})
export class StudyModule {}
