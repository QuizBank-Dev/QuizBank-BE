import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './schema/group.schema';
import { DB_TYPE } from 'src/database/database.const';
import { GroupRepository } from './group.repository';
import { DatabaseModule } from 'src/database/database.module';
import { QuizbookModule } from '../quizbook/quizbook.module';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: Group.name, schema: GroupSchema }],
			DB_TYPE.DEFAULT,
		),
		DatabaseModule,
		QuizbookModule,
	],
	controllers: [GroupController],
	providers: [GroupService, GroupRepository],
	exports: [GroupService, GroupRepository],
})
export class GroupModule {}
