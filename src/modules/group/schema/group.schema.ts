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
		default: function (): Types.ObjectId[] {
			const self = this as Group; // `this`를 Group 타입으로 캐스팅
			return [self.admin] as Types.ObjectId[]; // admin의 ObjectId가 들어간 배열을 기본값으로 설정
		},
	})
	memberList: Types.ObjectId[];

	@Prop({
		type: [{ type: Types.ObjectId, ref: 'GroupQuizbook' }],
		default: [],
	})
	groupQuizbookList: Types.ObjectId[] | GroupQuizbook[];

	// @Prop({ type: Types.ObjectId, ref: 'ChatRoom', required: true })
	// chatRoom: Types.ObjectId | ChatRoom;

	// Mongoose의 timestamps 옵션으로 자동 생성되는 필드
	createdAt?: Date; // 추가
	updatedAt?: Date; // 추가
}

export const GroupSchema = SchemaFactory.createForClass(Group);
