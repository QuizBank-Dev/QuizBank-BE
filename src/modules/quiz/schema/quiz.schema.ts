import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum QuizType {
	MULTIPLE_CHOICE = '객관식',
	SHORT_ANSWER = '주관식',
	LONG_ANSWER = '서술형',
	OX = 'ox',
}

@Schema({ timestamps: true })
export class Quiz extends Document {
	@Prop({ required: true, enum: QuizType })
	type: QuizType;

	@Prop({ required: true })
	question: string;

	@Prop({ required: true })
	answer: string;

	@Prop({
		type: [String],
	})
	optionList?: string[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

// 객관식일 경우 options 필수 설정
QuizSchema.pre('validate', function (next) {
	if (
		this.type === QuizType.MULTIPLE_CHOICE &&
		(!this.optionList || this.optionList.length !== 4)
	) {
		return next(new Error('객관식 문제는 4개의 보기를 포함해야 합니다.'));
	}

	next();
});
