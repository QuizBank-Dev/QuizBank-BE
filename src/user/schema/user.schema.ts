// TODO PR #6([Feat] 기본 리소스 생성 및 DB 스키마 정의) merge 후 주석부분 수정

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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
		// type: [{ enum: CategoryType }],
	})
	category: string[]; // CategoryType[]

	@Prop({
		default: 0,
	})
	experience: number;

	@Prop({
		type: Types.ObjectId,
		ref: 'Workbook',
	})
	recentWorkbook: Types.ObjectId; // Workbook

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
