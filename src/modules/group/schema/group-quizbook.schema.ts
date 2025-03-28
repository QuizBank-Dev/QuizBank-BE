import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { Quizbook } from 'src/modules/quizbook/schema/quizbook.schema';

@Schema({ timestamps: true })
export class GroupQuizbook extends Document {
	@ApiProperty({
		example: '65e8a5d6fc13ae5e7f000002',
		description: '그룹 선정 문제집 UUID',
	})
	_id: string;

	@ApiProperty({
		example: '65e8a5d6fc13ae5e7f000002',
		description: '문제집 UUID',
	})
	@Prop({ type: Types.ObjectId, ref: 'Quizbook', required: true })
	workbookId: Types.ObjectId | Quizbook;

	@ApiProperty({
		example: '2025-04-01T00:00:00Z',
		description: '그룹에서의 문제집 마감일',
	})
	@Prop({
		type: Date,
		required: true,
	})
	endDate: Date;
}

export const GroupQuizbookSchema = SchemaFactory.createForClass(GroupQuizbook);
