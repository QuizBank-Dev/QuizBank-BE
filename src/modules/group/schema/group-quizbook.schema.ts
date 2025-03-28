import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Quizbook } from 'src/modules/quizbook/schema/quizbook.schema';

@Schema({ timestamps: true })
export class GroupQuizbook extends Document {
	@Prop({ type: Types.ObjectId, ref: 'Quizbook', required: true })
	quizbook: Types.ObjectId | Quizbook;

	@Prop({
		type: Date,
		required: true,
	})
	endedAt: Date;
}

export const GroupQuizbookSchema = SchemaFactory.createForClass(GroupQuizbook);
