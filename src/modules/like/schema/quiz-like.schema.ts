import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Quiz } from 'src/modules/quiz/schema/quiz.schema';
import { User } from 'src/modules/user/schema/user.schema';

@Schema({ timestamps: true })
export class QuizLike {
	@Prop({
		type: Types.ObjectId,
		ref: 'User',
		required: true,
		index: true,
	})
	owner: Types.ObjectId | User;

	@Prop({
		type: Types.ObjectId,
		ref: 'Quiz',
		required: true,
		index: true,
	})
	quiz: Types.ObjectId | Quiz;
}

export const QuizLikeSchema = SchemaFactory.createForClass(QuizLike);

QuizLikeSchema.index({ owner: 1, quiz: 1 }, { unique: true });
