import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Quiz } from '../../quiz/schema/quiz.schema';

export enum CategoryType {
	DATA_STRUCTURE = '자료구조',
	ALGORITHM = '알고리즘',
	NETWORK = '네트워크',
	DATABASE = '데이터베이스',
	WEB = '웹 개발',
	ETC = '기타',
}

@Schema({ timestamps: true })
export class Quizbook extends Document<Quizbook> {
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
	quizzes: Types.ObjectId[] | Quiz[];

	@Prop({ default: 0 })
	solvedCount: number;

	@Prop({ default: 0 })
	solvedRate: number;

	@Prop({ default: 0 })
	reviewCount: number;

	@Prop({ default: 0 })
	reviewRate: number;

	//// User 모델 완성 시 추가
	// @Prop({
	// 	type: Types.ObjectId,
	// 	ref: 'User',
	// 	required: true,
	// })
	// author: Types.ObjectId | User;
}

export const QuizbookSchema = SchemaFactory.createForClass(Quizbook);
