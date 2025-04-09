import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ReadStatus extends Document {
	@Prop({
		type: Types.ObjectId,
		ref: 'ChatRoom',
		required: true,
	})
	chatRoom: Types.ObjectId;

	@Prop({ required: true })
	lastTimestamp: Date;

	@Prop({
		type: Types.ObjectId,
		ref: 'User',
		required: true,
	})
	member: Types.ObjectId;
}

export const ReadStatusSchema = SchemaFactory.createForClass(ReadStatus);
