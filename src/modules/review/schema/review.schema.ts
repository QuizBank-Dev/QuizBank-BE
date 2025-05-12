import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Quizbook } from 'src/modules/quizbook/schema/quizbook.schema';
import { User } from 'src/modules/user/schema/user.schema';

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

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index({ quizbook: 1, author: 1 });
ReviewSchema.index({ quizbook: 1 });
ReviewSchema.index({ author: 1 });
