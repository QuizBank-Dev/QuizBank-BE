import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/user/schema/user.schema';
import { GroupQuizbook } from './group-quizbook.schema';

@Schema({ timestamps: true })
export class Group extends Document {
	@ApiProperty({
		example: '65e8a5d6fc13ae5e7f000002',
		description: '그룹 UUID',
	})
	_id: string;

	@ApiProperty({
		example: '서울 강남 cs 공부 스터디',
		description: '그룹 이름',
	})
	@Prop({ required: true })
	name: string;

	@ApiProperty({
		example:
			'이 그룹은 강남권 개발 취업준비생들을 위한 cs 공부 스터디입니다.',
		description: '그룹 설명',
	})
	@Prop({ required: true })
	description: string;

	@ApiProperty({
		example: '65e8a5d6fc13ae5e7f000002',
		description: '그룹장 UUID',
	})
	@Prop({ type: Types.ObjectId, ref: 'User', required: true })
	admin: Types.ObjectId | User;

	@ApiProperty({
		example: '[65e8a5d6fc13ae5e7f000002,...]',
		description: '그룹원 UUID 배열',
	})
	@Prop({
		type: [{ type: Types.ObjectId, ref: 'User' }],
		required: true,
	})
	memberList: Types.ObjectId[] | User[];

	@ApiProperty({
		example: '[65e8a5d6fc13ae5e7f000002,...]',
		description: '그룹 선정 문제집 UUID 배열',
	})
	@Prop({
		type: [{ type: Types.ObjectId, ref: 'GroupQuizbook' }],
		required: true,
	})
	groupQuizbookList: Types.ObjectId[] | GroupQuizbook[];

	@ApiProperty({
		example: '65e8a5d6fc13ae5e7f000002',
		description: '그룹 채팅방 UUID',
	})
	@Prop({ type: Types.ObjectId, ref: 'ChatRoom', required: true })
	chatRoom: Types.ObjectId;
	// chatRoom: Types.ObjectId | ChatRoom;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
