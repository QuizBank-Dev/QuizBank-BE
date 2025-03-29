import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './schema/group.schema';
import { DB_TYPE } from 'src/database/database.const';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: Group.name, schema: GroupSchema }],
			DB_TYPE.DEFAULT,
		),
	],
	controllers: [GroupController],
	providers: [GroupService],
})
export class GroupModule {}
