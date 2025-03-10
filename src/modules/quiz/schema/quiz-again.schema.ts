import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Quiz } from './quiz.schema';

@Schema({ timestamps: true })
export class QuizAgain extends Document {
	@Prop({
		type: [{ type: Types.ObjectId, ref: 'Quiz' }],
		required: true,
	})
	quizzes: Types.ObjectId[] | Quiz[];

	//// User 모델 완성 시 추가
	// @Prop({
	// 	type: Types.ObjectId,
	// 	ref: 'User',
	// 	required: true,
	// })
	// user: Types.ObjectId | User;
}

export const QuizAgainSchema = SchemaFactory.createForClass(QuizAgain);
