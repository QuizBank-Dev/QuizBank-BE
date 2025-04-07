import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from './schema/like.schema';
import { DB_TYPE } from 'src/database/database.const';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { LikeRepository } from './like.repository';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: Like.name, schema: LikeSchema }],
			DB_TYPE.DEFAULT,
		),
	],
	controllers: [LikeController],
	providers: [LikeService, LikeRepository],
	exports: [LikeService, LikeRepository],
})
export class LikeModule {}
