import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Quiz } from 'src/modules/quiz/schema/quiz.schema';
import { Quizbook } from 'src/modules/quizbook/schema/quizbook.schema';
import { User } from 'src/modules/user/schema/user.schema';

@Schema({ timestamps: true })
export class Like extends Document {
	@Prop({
		type: [{ type: Types.ObjectId, ref: 'Quizbook' }],
		default: [],
	})
	quizbookList: Types.ObjectId[] | Quizbook[];

	@Prop({
		type: [{ type: Types.ObjectId, ref: 'Quiz' }],
		required: true,
	})
	quizList: Types.ObjectId[] | Quiz[];

	@Prop({
		type: Types.ObjectId,
		ref: 'User',
		required: true,
		unique: true,
	})
	owner: Types.ObjectId | User;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
