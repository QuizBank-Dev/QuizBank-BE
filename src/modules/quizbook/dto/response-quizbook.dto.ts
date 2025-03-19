import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Quizbook } from '../schema/quizbook.schema';
import { Types } from 'mongoose';
import { Quiz } from 'src/modules/quiz/schema/quiz.schema';

export class QuizbookCreateResponseDto extends Quizbook {
	@ApiProperty({
		type: 'array',
		items: { type: 'string', format: 'uuid' },
		example: ['65e8a5d6fc13ae5e7f000002'],
		description: '문제집 생성시 quizList는 UUID 배열로 반환됨.',
	})
	quizList: Types.ObjectId[];
}

export class QuizbookFindAllResponseDto extends Quizbook {
	@ApiProperty({
		type: 'array',
		items: { type: 'string', format: 'uuid' },
		example: ['65e8a5d6fc13ae5e7f000002'],
		description: '모든 문제집 조회시 quizList는 UUID 배열로 반환됨.',
	})
	quizList: Types.ObjectId[];
}

export class QuizbookFindOneResponseDto extends Quizbook {
	@ApiProperty({
		type: 'array',
		items: { $ref: getSchemaPath(Quiz) },
		description: '문제집 상세 조회 시 quizList는 Quiz 객체의 배열로 반환됨',
	})
	quizList: Quiz[];
}
