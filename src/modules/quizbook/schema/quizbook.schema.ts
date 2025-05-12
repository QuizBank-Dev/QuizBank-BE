import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Quiz } from '../../quiz/schema/quiz.schema';
import { User } from 'src/modules/user/schema/user.schema';

export enum CategoryType {
	DATA_STRUCTURE = '자료구조',
	ALGORITHM = '알고리즘',
	NETWORK = '네트워크',
	DATABASE = '데이터베이스',
	WEB = '웹 개발',
	ETC = '기타',
}

@Schema({ timestamps: true })
export class Quizbook extends Document {
	@Prop({ required: true })
	title: string;

	@Prop({ required: true })
	description: string;

	@Prop({ required: true, enum: CategoryType })
	category: CategoryType;

	@Prop({
		type: [{ type: Types.ObjectId, ref: 'Quiz' }],
		required: true,
	})
	quizList: Types.ObjectId[] | Quiz[];

	@Prop({ default: 0 })
	solvedCount: number;

	@Prop({ default: 0 })
	solvedScore: number;

	@Prop({ required: true })
	totalScore: number;

	@Prop({ default: 0 })
	reviewCount: number;

	@Prop({ default: 0 })
	reviewScore: number;

	@Prop({ default: 0 })
	reviewRating: number;

	@Prop({
		type: Types.ObjectId,
		ref: 'User',
		required: true,
	})
	author: Types.ObjectId | User;
}

export const QuizbookSchema = SchemaFactory.createForClass(Quizbook);

QuizbookSchema.index({ author: 1, _id: -1 });
QuizbookSchema.index({ category: 1, _id: -1 });
QuizbookSchema.index({ category: 1, reviewRating: -1, _id: -1 });
