import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { toObjectId } from 'src/common/utils/database.util';
import { FilterQuery, Types } from 'mongoose';
import { CreateGroupDto } from './dto/create-group.dto';
import { DatabaseService } from 'src/database/database.service';
import { Group } from './schema/group.schema';
import { AuthTokenService } from '../auth/auth-token/auth-token.service';
import { TokenType } from '../auth/auth-token/auth-token.types';
import { InviteTokenPayloadDto } from './dto/invite-token-payload.dto';
import { GroupQuizbookRepository } from './group-quizbook/group-quizbook.repository';
import { ChatRoomRepository } from '../chat/repository/chat-room.repository';
import { ReadStatusRepository } from '../chat/repository/read-status.repository';
import { ChatRoomType } from '../chat/schema/chat-room.schema';
import { GroupQueryDto } from './dto/group-query.dto';
import { GroupQuizbook } from './group-quizbook/schema/group-quizbook.schema';
import { ConfigService } from '@nestjs/config';
import { envKeys } from 'src/config/env.const';

@Injectable()
export class GroupService {
	constructor(
		private readonly groupRepository: GroupRepository,
		private readonly databaseService: DatabaseService,
		private readonly authTokenService: AuthTokenService,
		private readonly groupQuizbookRepository: GroupQuizbookRepository,
		private readonly chatRoomRepository: ChatRoomRepository,
		private readonly readStatusRepository: ReadStatusRepository,
		private readonly configService: ConfigService,
	) {}

	async getGroupList(query: GroupQueryDto) {
		const groupList = await this.groupRepository.findGroupList(query);

		const leftCount = await this.groupRepository.findLeftCount(query);

		// 그룹 정보를 변환
		const transformedGroups = groupList.map((group) => {
			const {
				memberList,
				applyingUserList,
				groupQuizbookList,
				createdAt,
				updatedAt,
				chatRoom,
				...filteredFields
			} = group.toObject();

			// 간단히 변수 사용 처리
			void applyingUserList;
			void groupQuizbookList;
			void createdAt;
			void updatedAt;
			void chatRoom;

			// memberCount 계산
			const memberCount = memberList.length;

			return {
				...filteredFields,
				memberCount,
			};
		});

		return {
			list: transformedGroups,
			nextCursor:
				transformedGroups.length > 0
					? transformedGroups[transformedGroups.length - 1]._id
					: null,
			leftCount: leftCount - transformedGroups.length,
		};
	}

	async getMyGroupList(userId: string, query: GroupQueryDto) {
		const groupList = await this.groupRepository.findGroupList(
			query,
			toObjectId(userId),
		);

		const leftCount = await this.groupRepository.findLeftCount(
			query,
			toObjectId(userId),
		);

		// 그룹 정보를 변환
		const transformedGroups = groupList.map((group) => {
			const {
				memberList,
				applyingUserList,
				groupQuizbookList,
				createdAt,
				updatedAt,
				...filteredFields
			} = group.toObject();

			// 간단히 변수 사용 처리
			void applyingUserList;
			void groupQuizbookList;
			void createdAt;
			void updatedAt;

			// memberCount 계산
			const memberCount = memberList.length;

			return {
				...filteredFields,
				memberCount,
			};
		});

		return {
			list: transformedGroups,
			nextCursor:
				transformedGroups.length > 0
					? transformedGroups[transformedGroups.length - 1]._id
					: null,
			leftCount: leftCount - transformedGroups.length,
		};
	}

	async getGroupInfo(userId: string, groupId: string) {
		const group = await this.groupRepository.findById(groupId);

		if (!group)
			throw new NotFoundException(
				`해당 ${groupId} Group을 찾을 수 없습니다.`,
			);

		const { memberList, groupQuizbookList, updatedAt, ...filteredFields } =
			group.toObject();

		void groupQuizbookList;
		void updatedAt;

		if (!memberList.map((user) => user._id.toString()).includes(userId))
			throw new UnauthorizedException(`허가되지 않는 접근입니다.`);

		return {
			...filteredFields,
			memberList,
		};
	}

	async postCreateGroup(userId: string, request: CreateGroupDto) {
		return this.databaseService.runInDefaultTransaction(async (session) => {
			// ChatRoom 생성
			const newChatRoom = await this.chatRoomRepository.create(
				{ type: ChatRoomType.GROUP, memberList: [toObjectId(userId)] },
				session,
			);

			// 그룹장의 ReadStatus 생성
			await this.readStatusRepository.create(
				{
					chatRoom: newChatRoom._id as Types.ObjectId,
					lastTimestamp: new Date(),
					member: toObjectId(userId),
				},
				session,
			);

			const data = {
				...request,
				admin: toObjectId(userId),
				chatRoom: newChatRoom._id as Types.ObjectId,
			};

			const newGroup = await this.groupRepository.create(data, session);

			const memberData = { memberList: [toObjectId(userId)] };

			await this.groupRepository.update(
				memberData,
				(newGroup._id as Types.ObjectId).toString(),
				session,
			);

			return {
				_id: newGroup._id,
			};
		});
	}

	async patchUpdateGroup(
		userId: string,
		groupId: string,
		request: CreateGroupDto,
	) {
		const group = await this.groupRepository.findById(groupId);

		if (!group)
			throw new NotFoundException(
				`해당 ${groupId} Group을 찾을 수 없습니다.`,
			);

		if (group.admin._id.toString() !== userId)
			throw new UnauthorizedException(`허가되지 않는 접근입니다.`);

		await this.groupRepository.update(request, groupId);
	}

	async deleteGroup(userId: string, groupId: string, reuse?: Group) {
		let group: Group | null;

		if (!reuse) {
			group = await this.groupRepository.findById(groupId);

			if (!group)
				throw new NotFoundException(
					`해당 ${groupId} Group을 찾을 수 없습니다.`,
				);
		} else {
			group = reuse;
		}

		if (group.admin._id.toString() !== userId)
			throw new UnauthorizedException(`허가되지 않는 접근입니다.`);

		await this.databaseService.runInDefaultTransaction(async (session) => {
			await Promise.all(
				(group.groupQuizbookList as GroupQuizbook[]).map(
					async (groupQuizbook) => {
						await this.groupQuizbookRepository.deleteById(
							(groupQuizbook._id as Types.ObjectId).toString(),
							session,
						);
					},
				),
			);

			// 그룹원들의 ReadStatus 제거
			await this.readStatusRepository.deleteAll(group.chatRoom, session);

			// 그룹의 ChatRoom 제거
			await this.chatRoomRepository.delete(group.chatRoom, session);

			await this.groupRepository.delete(groupId, session);
		});
	}

	async patchGroupApplying(userId: string, groupId: string) {
		const group = await this.groupRepository.findById(groupId);

		if (!group)
			throw new NotFoundException(
				`해당 ${groupId} Group을 찾을 수 없습니다.`,
			);

		const targetMemberList = group.memberList.map((user) =>
			user._id.toString(),
		);
		const indexOfNewOwner = targetMemberList.indexOf(userId);

		if (indexOfNewOwner !== -1)
			throw new UnauthorizedException(
				`해당 ${userId} 사용자는 이미 그룹에 소속되어 있습니다.`,
			);

		await this.groupRepository.update(
			{
				$addToSet: { applyingUserList: userId },
			},
			groupId,
		);
	}

	async patchRespondToApplication(
		userId: string,
		groupId: string,
		accepted: boolean,
	) {
		const group = await this.groupRepository.findById(groupId);

		if (!group)
			throw new NotFoundException(
				`해당 ${groupId} Group을 찾을 수 없습니다.`,
			);

		const targetApplyingUserList = group.applyingUserList.map((user) =>
			user._id.toString(),
		);
		const indexOfApplyingUser = targetApplyingUserList.indexOf(userId);

		if (indexOfApplyingUser === -1)
			throw new NotFoundException(
				`해당 ${userId} 사용자는 그룹에 가입 요청을 하지 않았습니다.`,
			);

		let filter: FilterQuery<Group>;
		if (accepted) {
			filter = {
				$pull: { applyingUserList: userId },
				$addToSet: { memberList: userId },
			};
		} else {
			filter = {
				$pull: { applyingUserList: userId },
			};
		}
		await this.groupRepository.update(filter, groupId);
	}

	async getInviteUrl(userId: string, groupId: string) {
		const group = await this.groupRepository.findById(groupId);

		if (!group)
			throw new NotFoundException(
				`해당 ${groupId} Group을 찾을 수 없습니다.`,
			);

		const targetMemberList = group.memberList.map((user) =>
			user._id.toString(),
		);
		const indexOfNewOwner = targetMemberList.indexOf(userId);

		if (indexOfNewOwner === -1)
			throw new UnauthorizedException(`허가되지 않는 접근입니다.`);

		const token =
			this.authTokenService.generateToken<InviteTokenPayloadDto>(
				TokenType.INVITE,
				{ groupId },
			);

		const isDev = this.configService.get<string>(envKeys.ENV) === 'dev';
		const clientUrl = this.configService.get<string>(
			isDev ? envKeys.CLIENT.LOCAL : envKeys.CLIENT.PROD,
		);

		return {
			url: `${clientUrl}/login?token=${token}`,
		};
	}

	async postCreateGroupMember(userId: string, token: string) {
		if (await this.authTokenService.isExpiredToken(token)) {
			throw new UnauthorizedException('인증정보가 올바르지 않습니다.');
		}

		const { groupId } =
			this.authTokenService.verifyToken<InviteTokenPayloadDto>(
				TokenType.INVITE,
				token,
			);

		const group = await this.groupRepository.findById(groupId);

		if (!group)
			throw new NotFoundException(
				`해당 ${groupId} Group을 찾을 수 없습니다.`,
			);

		await this.databaseService.runInDefaultTransaction(async (session) => {
			await this.groupRepository.update(
				{
					$addToSet: { memberList: userId }, // 중복 없이 배열에 userId 추가
				},
				groupId,
				session,
			);

			// 그룹의 ChatRoom에 그룹원 추가
			await this.chatRoomRepository.update(
				{
					$addToSet: { memberList: userId }, // 중복 없이 배열에 userId 추가
				},
				group.chatRoom,
				session,
			);

			// 추가된 그룹원의 ReadStatus 추가
			await this.readStatusRepository.create(
				{
					chatRoom: group.chatRoom,
					lastTimestamp: new Date(),
					member: toObjectId(userId),
				},
				session,
			);
		});

		await this.authTokenService.expireToken(token);
	}

	async patchGroupOwner(userId: string, groupId: string, memberId: string) {
		const group = await this.groupRepository.findById(groupId);

		if (!group)
			throw new NotFoundException(
				`해당 ${groupId} Group을 찾을 수 없습니다.`,
			);

		if (group.admin._id.toString() !== userId)
			throw new UnauthorizedException(`허가되지 않는 접근입니다.`);

		const targetMemberList = group.memberList.map((user) =>
			user._id.toString(),
		);
		const indexOfNewOwner = targetMemberList.indexOf(memberId);

		if (indexOfNewOwner === -1)
			throw new NotFoundException(
				`해당 ${memberId} 사용자를 찾을 수 없습니다.`,
			);

		targetMemberList.unshift(
			targetMemberList.splice(indexOfNewOwner, 1)[0],
		);

		await this.groupRepository.update(
			{
				admin: toObjectId(memberId),
				memberList: targetMemberList,
			},
			groupId,
		);
	}

	async deleteGroupWithdraw(userId: string, groupId: string) {
		const group = await this.groupRepository.findById(groupId);

		if (!group)
			throw new NotFoundException(
				`해당 ${groupId} Group을 찾을 수 없습니다.`,
			);

		// 혼자인 경우
		if (group.memberList.length === 1) {
			await this.deleteGroup(userId, groupId, group);
			return;
		}

		const targetMemberList = group.memberList.map((user) =>
			user._id.toString(),
		);
		const indexOfNewOwner = targetMemberList.indexOf(userId);

		if (indexOfNewOwner === -1)
			throw new NotFoundException(
				`해당 ${userId} 사용자를 찾을 수 없습니다.`,
			);

		await this.databaseService.runInDefaultTransaction(async (session) => {
			let data: Partial<Group> | FilterQuery<Group>;

			// 요청자가 그룹장인 경우
			if (group.admin._id.toString() === userId) {
				data = {
					admin: group.memberList[1]._id,
					$pull: { memberList: userId },
				};
			} else {
				data = { $pull: { memberList: userId } };
			}

			await this.groupRepository.update(data, groupId, session);

			// 해당 유저의 ReadStatus 삭제
			await this.readStatusRepository.delete(
				toObjectId(userId),
				group.chatRoom,
				session,
			);

			// 그룹의 ChatRoom에 그룹원 삭제
			await this.chatRoomRepository.update(
				{
					$pull: { memberList: userId },
				},
				group.chatRoom,
				session,
			);
		});
	}

	async deleteGroupMember(userId: string, groupId: string, memberId: string) {
		const group = await this.groupRepository.findById(groupId);

		if (!group)
			throw new NotFoundException(
				`해당 ${groupId} Group을 찾을 수 없습니다.`,
			);

		if (group.admin._id.toString() !== userId)
			throw new UnauthorizedException(`허가되지 않는 접근입니다.`);

		await this.databaseService.runInDefaultTransaction(async (session) => {
			await this.groupRepository.update(
				{ $pull: { memberList: memberId } },
				groupId,
				session,
			);

			// 해당 유저의 ReadStatus 삭제
			await this.readStatusRepository.delete(
				toObjectId(memberId),
				group.chatRoom,
				session,
			);

			// 그룹의 ChatRoom에 그룹원 삭제
			await this.chatRoomRepository.update(
				{
					$pull: { memberList: memberId },
				},
				group.chatRoom,
				session,
			);
		});
	}
}
