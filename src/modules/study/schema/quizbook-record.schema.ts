import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Quizbook } from 'src/modules/quizbook/schema/quizbook.schema';
import { User } from 'src/modules/user/schema/user.schema';
import { QuizRecord } from './quiz-record.schema';

@Schema({ timestamps: true })
export class QuizbookRecord extends Document {
	@Prop({
		type: Types.ObjectId,
		ref: 'Quizbook',
		required: true,
	})
	quizbook: Types.ObjectId | Quizbook;

	@Prop({
		type: [{ type: Types.ObjectId, ref: 'QuizRecord' }],
		required: true,
	})
	quizRecordList: Types.ObjectId[] | QuizRecord[];

	@Prop({
		required: true,
	})
	score: number;

	@Prop({
		type: Types.ObjectId,
		ref: 'User',
		required: true,
	})
	owner: Types.ObjectId | User;

	@Prop()
	readonly createdAt: Date;

	@Prop()
	readonly updatedAt: Date;
}

export const QuizbookRecordSchema =
	SchemaFactory.createForClass(QuizbookRecord);

QuizbookRecordSchema.index({ owner: 1, quizbookId: 1 });
