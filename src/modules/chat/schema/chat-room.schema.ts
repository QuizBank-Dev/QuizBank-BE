import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ChatRoomType {
	Group = 'group',
	individual = 'user',
}

@Schema({ timestamps: true })
export class ChatRoom extends Document {
	@Prop({ required: true, enum: ChatRoomType })
	type: ChatRoomType;

	@Prop({
		type: [{ type: Types.ObjectId, ref: 'User' }],
		default: [],
	})
	memberList: Types.ObjectId[];
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
