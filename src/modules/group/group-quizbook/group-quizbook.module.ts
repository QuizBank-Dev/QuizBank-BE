import { forwardRef, Module } from '@nestjs/common';
import { GroupQuizbookController } from './group-quizbook.controller';
import { GroupQuizbookService } from './group-quizbook.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
	GroupQuizbook,
	GroupQuizbookSchema,
} from './schema/group-quizbook.schema';
import { DB_TYPE } from 'src/database/database.const';
import { DatabaseModule } from 'src/database/database.module';
import { GroupQuizbookRepository } from './group-quizbook.repository';
import { GroupModule } from '../group.module';
import { QuizbookModule } from 'src/modules/quizbook/quizbook.module';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: GroupQuizbook.name, schema: GroupQuizbookSchema }],
			DB_TYPE.DEFAULT,
		),
		DatabaseModule,
		forwardRef(() => GroupModule),
		forwardRef(() => QuizbookModule),
	],
	controllers: [GroupQuizbookController],
	providers: [GroupQuizbookService, GroupQuizbookRepository],
	exports: [GroupQuizbookService, GroupQuizbookRepository],
})
export class GroupQuizbookModule {}
