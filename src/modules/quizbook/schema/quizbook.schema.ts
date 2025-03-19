import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Quiz } from '../../quiz/schema/quiz.schema';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

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
	@ApiProperty({
		example: '알고리즘 문제집',
		description: '퀴즈북 제목',
	})
	@Prop({ required: true })
	title: string;

	@ApiProperty({
		example: '이 문제집은 알고리즘 면접을 준비하는 사람들을 위한 것입니다.',
		description: '문제집 설명',
	})
	@Prop({ required: true })
	description: string;

	@ApiProperty({
		example: CategoryType.ALGORITHM,
		enum: CategoryType,
		description: '문제집 카테고리',
	})
	@Prop({ required: true, enum: CategoryType })
	category: CategoryType;

	@Prop({
		type: [{ type: Types.ObjectId, ref: 'Quiz' }],
		required: true,
	})
	quizList: Types.ObjectId[] | Quiz[];

	@ApiProperty({ example: 100, description: '문제집을 풀이한 사용자 수' })
	@Prop({ default: 0 })
	solvedCount: number;

	@ApiProperty({ example: 85.5, description: '문제집 정답률(%)' })
	@Prop({ default: 0 })
	solvedRate: number;

	@ApiProperty({ example: 10, description: '리뷰 수' })
	@Prop({ default: 0 })
	reviewCount: number;

	@ApiProperty({ example: 4.5, description: '평균 리뷰 평점' })
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
