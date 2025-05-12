import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Quiz, QuizType } from 'src/modules/quiz/schema/quiz.schema';
import { User } from 'src/modules/user/schema/user.schema';

export enum RoleType {
	AI = 'AI',
	USER = 'User',
}

@Schema({ timestamps: true })
export class QuizRecord extends Document {
	@Prop({
		required: true,
		enum: QuizType,
	})
	type: QuizType;

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

	@Prop({
		type: Types.ObjectId,
		ref: 'User',
		required: true,
	})
	owner: Types.ObjectId | User;
}

export const QuizRecordSchema = SchemaFactory.createForClass(QuizRecord);

QuizRecordSchema.index({ owner: 1, quizbookId: 1 });
