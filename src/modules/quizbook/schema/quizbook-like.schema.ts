import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Quizbook } from './quizbook.schema';

@Schema({ timestamps: true })
export class QuizbookLike extends Document {
	@Prop({
		type: [{ type: Types.ObjectId, ref: 'Quizbook' }],
		required: true,
	})
	quizbooks: Types.ObjectId[] | Quizbook[];

	//// User 모델 완성 시 추가
	// @Prop({
	// 	type: Types.ObjectId,
	// 	ref: 'User',
	// 	required: true,
	// })
	// user: Types.ObjectId | User;
}

export const QuizbookLikeSchema = SchemaFactory.createForClass(QuizbookLike);
