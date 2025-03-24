import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Query, Types } from 'mongoose';
import { CategoryType, Quizbook } from '../../quizbook/schema/quizbook.schema';

export enum ProviderType {
	GOOGLE = 'Google',
	KAKAO = 'Kakao',
	NAVER = 'Naver',
	GITHUB = 'GitHub',
}

@Schema({ timestamps: true })
export class User extends Document<string> {
	@Prop({
		required: true,
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

	@Prop({ type: Date, default: null, select: false })
	deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1, deletedAt: 1 }, { unique: true });

/**
 * User 조회 시 삭제된 유저를 제외하고 조회하기 위한 미들웨어
 */
UserSchema.pre(/^find/, function (this: Query<any, any>, next) {
	// populate를 사용해 조회하는 경우 제외
	if (this.getOptions().populate) {
		return next();
	}

	this.setQuery({ ...this.getQuery(), deletedAt: null });
	next();
});
