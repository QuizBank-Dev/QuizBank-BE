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
	})
	email: string;

	@Prop()
	password: string;

	@Prop({
		required: true,
	})
	nickname: string;

	@Prop({
		enum: ProviderType,
	})
	oAuth: ProviderType;

	@Prop({
		type: [{ enum: CategoryType }],
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
