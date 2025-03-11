import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Quizbook } from './quizbook.schema';
import { QuizRecord } from 'src/modules/quiz/schema/quiz-record.schema';

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
	quizRecords: Types.ObjectId[] | QuizRecord[];

	@Prop({
		required: true,
	})
	score: number;

	//// User 모델 완성 시 추가
	// @Prop({
	// 	type: Types.ObjectId,
	// 	ref: 'User',
	// 	required: true,
	// })
	// user: Types.ObjectId | User;
}

export const QuizbookRecordSchema =
	SchemaFactory.createForClass(QuizbookRecord);
