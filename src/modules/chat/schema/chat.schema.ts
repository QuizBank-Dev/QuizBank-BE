import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Chat extends Document {
	@Prop({
		type: Types.ObjectId,
		ref: 'ChatRoom',
		required: true,
	})
	chatRoom: Types.ObjectId;

	@Prop({
		type: Types.ObjectId,
		ref: 'User',
		required: true,
	})
	sender: Types.ObjectId;

	@Prop({ required: true })
	content: string;

	// Mongoose의 timestamps 옵션으로 자동 생성되는 필드
	createdAt?: Date; // 추가
	updatedAt?: Date; // 추가
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
// TTL 인덱스 설정 (30일 = 2592000초)
ChatSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });
