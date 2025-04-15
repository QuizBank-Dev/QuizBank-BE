import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Quizbook } from 'src/modules/quizbook/schema/quizbook.schema';
import { User } from 'src/modules/user/schema/user.schema';

@Schema({ timestamps: true })
export class QuizbookLike {
	@Prop({
		type: Types.ObjectId,
		ref: 'User',
		required: true,
		index: true,
	})
	owner: Types.ObjectId | User;

	@Prop({
		type: Types.ObjectId,
		ref: 'Quizbook',
		required: true,
		index: true,
	})
	quizbook: Types.ObjectId | Quizbook;
}

export const QuizbookLikeSchema = SchemaFactory.createForClass(QuizbookLike);
QuizbookLikeSchema.index({ owner: 1, quizbook: 1 }, { unique: true });
