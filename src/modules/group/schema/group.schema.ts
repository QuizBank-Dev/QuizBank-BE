import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/user/schema/user.schema';
import { GroupQuizbook } from './group-quizbook.schema';

@Schema({ timestamps: true })
export class Group extends Document {
	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	description: string;

	@Prop({ type: Types.ObjectId, ref: 'User', required: true })
	admin: Types.ObjectId | User;

	@Prop({
		type: [{ type: Types.ObjectId, ref: 'User' }],
		required: true,
	})
	memberList: Types.ObjectId[] | User[];

	@Prop({
		type: [{ type: Types.ObjectId, ref: 'GroupQuizbook' }],
		required: true,
	})
	groupQuizbookList: Types.ObjectId[] | GroupQuizbook[];

	// @Prop({ type: Types.ObjectId, ref: 'ChatRoom', required: true })
	// chatRoom: Types.ObjectId | ChatRoom;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
