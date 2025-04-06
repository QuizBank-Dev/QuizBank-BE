import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Group extends Document {
	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	description: string;

	@Prop({ type: Types.ObjectId, ref: 'User', required: true })
	admin: Types.ObjectId;

	@Prop({
		type: [{ type: Types.ObjectId, ref: 'User' }],
		default: [],
	})
	memberList: Types.ObjectId[];

	@Prop({
		type: [{ type: Types.ObjectId, ref: 'GroupQuizbook' }],
		default: [],
	})
	groupQuizbookList: Types.ObjectId[];

	@Prop({ type: Types.ObjectId, ref: 'ChatRoom', required: true })
	chatRoom: Types.ObjectId;

	// Mongoose의 timestamps 옵션으로 자동 생성되는 필드
	createdAt?: Date; // 추가
	updatedAt?: Date; // 추가
}

export const GroupSchema = SchemaFactory.createForClass(Group);
