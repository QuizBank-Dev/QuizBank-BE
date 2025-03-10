import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Quiz } from '../quiz/quiz.schema';

@Schema({ timestamps: true })
export class Comment extends Document {
	@Prop({ default: 0 })
	depth: number;

	@Prop({ required: true })
	content: string;

	@Prop({
		type: Types.ObjectId,
		ref: 'Quiz',
		required: true,
	})
	quiz: Types.ObjectId | Quiz;

	@Prop({
		type: [{ type: Types.ObjectId, ref: 'Comment' }],
		default: [],
	})
	replies: Types.ObjectId[] | Comment[];

	//// User 모델 완성 시 추가
	// @Prop({
	// 	type: Types.ObjectId,
	// 	ref: 'User',
	// 	required: true,
	// })
	// author: Types.ObjectId | User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
