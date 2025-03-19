import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum QuizType {
	MULTIPLE_CHOICE = '객관식',
	SHORT_ANSWER = '주관식',
	LONG_ANSWER = '서술형',
	OX = 'ox',
}

@Schema({ timestamps: true })
export class Quiz extends Document {
	@ApiProperty({
		example: '65e8a5d6fc13ae5e7f000002',
		description: '퀴즈 UUID',
	})
	_id: string;

	@ApiProperty({
		enum: QuizType,
		example: QuizType.MULTIPLE_CHOICE,
		description: '퀴즈 유형',
	})
	@Prop({ required: true, enum: QuizType })
	type: QuizType;

	@ApiProperty({
		example: '퀵 정렬의 시간 복잡도는?',
		description: '퀴즈 질문',
	})
	@Prop({ required: true })
	question: string;

	@ApiProperty({
		example: 'O(n log n)',
		description: '퀴즈 정답',
	})
	@Prop({ required: true })
	answer: string;

	@ApiProperty({
		example: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(1)'],
		description: '객관식 문제의 선택지 (객관식일 경우 필수)',
		required: false,
	})
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
