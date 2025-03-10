import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Quiz } from './quiz.schema';

export enum RoleType {
	AI = 'AI',
	USER = 'User',
}

@Schema({ timestamps: true })
export class QuizRecord extends Document {
	@Prop({
		required: true,
		enum: RoleType,
	})
	role: RoleType;

	@Prop({
		required: true,
	})
	answer: string;

	@Prop({
		required: true,
	})
	score: number;

	@Prop({
		type: Types.ObjectId,
		ref: 'Quiz',
		required: true,
	})
	quiz: Types.ObjectId | Quiz;

	//// User 모델 완성 시 추가
	// @Prop({
	// 	type: Types.ObjectId,
	// 	ref: 'User',
	// 	required: true,
	// })
	// user: Types.ObjectId | User;
}

export const QuizRecordSchema = SchemaFactory.createForClass(QuizRecord);
