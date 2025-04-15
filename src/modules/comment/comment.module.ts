import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schema/comment.schema';
import { DB_TYPE } from 'src/database/database.const';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: Comment.name, schema: CommentSchema }],
			DB_TYPE.DEFAULT,
		),
	],
	controllers: [CommentController],
	providers: [CommentService, CommentRepository],
	exports: [CommentService, CommentRepository],
})
export class CommentModlue {}
