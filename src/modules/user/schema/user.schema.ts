import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CategoryType, Quizbook } from '../../quizbook/schema/quizbook.schema';

export enum ProviderType {
	GOOGLE = 'Google',
	KAKAO = 'Kakao',
	NAVER = 'Naver',
	GITHUB = 'GitHub',
}

@Schema({ timestamps: true })
export class User extends Document {
	@Prop({
		required: true,
		unique: true,
	})
	email: string;

	@Prop({
		select: false,
	})
	password: string;

	@Prop({
		required: true,
	})
	nickname: string;

	@Prop({
		type: String,
		enum: ProviderType,
	})
	oAuth: ProviderType;

	@Prop({
		type: [{ type: String, enum: CategoryType }],
	})
	category: CategoryType[];

	@Prop({
		default: 0,
	})
	experience: number;

	@Prop({
		type: Types.ObjectId,
		ref: 'Quizbook',
	})
	recentWorkbook: Types.ObjectId | Quizbook;

	@Prop()
	profileImg: string;

	@Prop({
		type: [{ type: Types.ObjectId, ref: 'User' }],
		default: [],
	})
	follower: Types.ObjectId[] | User[];

	@Prop({
		type: [{ type: Types.ObjectId, ref: 'User' }],
		default: [],
	})
	following: Types.ObjectId[] | User[];

	@Prop()
	introduce: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
