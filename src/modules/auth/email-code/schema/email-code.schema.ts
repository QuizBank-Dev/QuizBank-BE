import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class EmailCode extends Document {
	@Prop({
		required: true,
	})
	email: string;

	@Prop({
		required: true,
	})
	code: string;

	@Prop({
		type: Date,
		expires: 300, // 300s
	})
	expiredAt: Date;
}

export const EmailCodeSchema = SchemaFactory.createForClass(EmailCode);
