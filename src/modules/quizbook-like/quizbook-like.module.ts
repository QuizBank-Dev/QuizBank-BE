import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
	QuizbookLike,
	QuizbookLikeSchema,
} from './schema/quizbook-like.schema';
import { DB_TYPE } from 'src/database/database.const';
import { QuizbookLikeController } from './quizbook-like.controller';
import { QuizbookLikeService } from './quizbook-like.service';
import { QuizbookLikeRepository } from './quizbook-like.repository';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: QuizbookLike.name, schema: QuizbookLikeSchema }],
			DB_TYPE.DEFAULT,
		),
	],
	controllers: [QuizbookLikeController],
	providers: [QuizbookLikeService, QuizbookLikeRepository],
	exports: [QuizbookLikeService, QuizbookLikeRepository],
})
export class QuizbookLikeModule {}
