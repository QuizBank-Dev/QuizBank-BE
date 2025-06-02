import { forwardRef, Module } from '@nestjs/common';
import { QuizbookService } from './quizbook.service';
import { QuizbookController } from './quizbook.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Quizbook, QuizbookSchema } from './schema/quizbook.schema';
import { DB_TYPE } from 'src/database/database.const';
import { QuizbookRepository } from './quizbook.repository';
import { QuizModule } from '../quiz/quiz.module';
import { DatabaseModule } from 'src/database/database.module';
import { LikeModule } from '../like/like.module';
import { StudyModule } from '../study/study.module';
import { AIModule } from '../ai/ai.module';
import { GroupModule } from '../group/group.module';
import { GroupQuizbookModule } from '../group/group-quizbook/group-quizbook.module';
import { SitemapModule } from '../sitemap/sitemap.module';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: Quizbook.name, schema: QuizbookSchema }],
			DB_TYPE.DEFAULT,
		),
		forwardRef(() => QuizModule),
		forwardRef(() => LikeModule),
		forwardRef(() => StudyModule),
		forwardRef(() => AIModule),
		forwardRef(() => GroupModule),
		forwardRef(() => GroupQuizbookModule),
		forwardRef(() => SitemapModule),
		DatabaseModule,
	],
	controllers: [QuizbookController],
	providers: [QuizbookService, QuizbookRepository],
	exports: [QuizbookService, QuizbookRepository],
})
export class QuizbookModule {}
