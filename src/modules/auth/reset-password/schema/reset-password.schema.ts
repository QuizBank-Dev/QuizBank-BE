import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class ResetPassword extends Document {
	@Prop({
		required: true,
	})
	email: string;

	@Prop({
		type: Types.ObjectId,
		ref: 'User',
		required: true,
	})
	userId: Types.ObjectId;

	@Prop({
		required: true,
	})
	token: string;

	@Prop({
		required: true,
		default: false,
	})
	used: boolean;

	@Prop({
		type: Date,
		expires: 300, // 300s
	})
	expiredAt: Date;
}

export const ResetPasswordSchema = SchemaFactory.createForClass(ResetPassword);
