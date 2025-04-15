import { Module } from '@nestjs/common';
import { StudyLogController } from './study-log.controller';
import { StudyLogService } from './study-log.service';
import { StudyLogRepository } from './study-log.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_TYPE } from 'src/database/database.const';
import { StudyLog, StudyLogSchema } from './schema/study-log.schema';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: StudyLog.name, schema: StudyLogSchema }],
			DB_TYPE.DEFAULT,
		),
	],
	controllers: [StudyLogController],
	providers: [StudyLogService, StudyLogRepository],
	exports: [StudyLogService, StudyLogRepository],
})
export class StudyLogModule {}
