import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/user/schema/user.schema';

@Schema({ timestamps: true })
export class StudyLog extends Document {
	@Prop({
		type: Types.ObjectId,
		ref: 'User',
		required: true,
	})
	owner: Types.ObjectId | User;

	@Prop({ required: true })
	date: string;

	@Prop({ default: 0 })
	solvedCount: number;
}

export const StudyLogSchema = SchemaFactory.createForClass(StudyLog);

StudyLogSchema.index({ owner: 1, date: 1 });
