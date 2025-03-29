import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Quiz } from '../../quiz/schema/quiz.schema';
import { User } from 'src/modules/user/schema/user.schema';

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

	@Prop({
		type: Types.ObjectId,
		ref: 'User',
		required: true,
	})
	author: Types.ObjectId | User;

	@Prop({
		type: Date,
	})
	deletedAt?: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
