import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Quizbook } from 'src/modules/quizbook/schema/quizbook.schema';

@Schema({ timestamps: true })
export class Review extends Document {
	@Prop({
		required: true,
	})
	score: number;

	@Prop({
		required: true,
	})
	content: string;

	@Prop({
		type: Types.ObjectId,
		ref: 'Quizbook',
		required: true,
	})
	quizbook: Types.ObjectId | Quizbook;

	//// User 모델 완성 시 추가
	// @Prop({
	// 	type: Types.ObjectId,
	// 	ref: 'User',
	// 	required: true,
	// })
	// author: Types.ObjectId | User;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
