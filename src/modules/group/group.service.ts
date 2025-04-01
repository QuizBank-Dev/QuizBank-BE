import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { QuizbookRepository } from '../quizbook/quizbook.repository';
import { GroupQuizbook } from './schema/group-quizbook.schema';
import { toObjectId } from 'src/common/utils/database.util';
import { FilterQuery, Types } from 'mongoose';
import { CreateGroupDto } from './dto/create-group.dto';
import { DatabaseService } from 'src/database/database.service';
import { Group } from './schema/group.schema';
import { AuthTokenService } from '../auth/auth-token/auth-token.service';
import { TokenType } from '../auth/auth-token/auth-token.types';
import { InviteTokenPayloadDto } from './dto/invite-token-payload.dto';

@Injectable()
export class GroupService {
	constructor(
		private readonly groupRepository: GroupRepository,
		private readonly quizbookRepository: QuizbookRepository,
		private readonly databaseService: DatabaseService,
		private readonly authTokenService: AuthTokenService,
	) {}

	async makeImminentQuizbook(
		groupQuizbookList: Types.ObjectId[] | GroupQuizbook[],
	) {
		// imminentQuizbook 계산: endedAt이 오늘 이후인 문제집 중 가장 가까운 날짜를 찾음
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
		const day = String(today.getDate()).padStart(2, '0');
		const todayDate = new Date(`${year}-${month}-${day}`);
		const quizbookList = groupQuizbookList
			.filter((quizbook: GroupQuizbook) => quizbook.endedAt >= todayDate) // 오늘 이후만 포함
			.sort(
				(a: GroupQuizbook, b: GroupQuizbook) =>
					new Date(a.endedAt).getTime() -
					new Date(b.endedAt).getTime(),
			) as GroupQuizbook[];

		let result = {};

		if (quizbookList.length !== 0) {
			const targetId = quizbookList[0].quizbook.toString();
			const targetQuizbook =
				await this.quizbookRepository.findById(targetId);

			if (!targetQuizbook)
				throw new NotFoundException(
					`해당 ${targetId} Quizbook을 찾을 수 없습니다.`,
				);

			result = targetQuizbook;
		}

		return result;
	}

	async getAllBelongedGroup(userId: string) {
		const groupList =
			await this.groupRepository.findAllBelongedGroupById(userId);

		// 그룹 정보를 변환
		const transformedGroups = await Promise.all(
			groupList.map(async (group) => {
				const {
					memberList,
					groupQuizbookList,
					createdAt,
					updatedAt,
					...filteredFields
				} = group.toObject();

				// 간단히 변수 사용 처리
				void createdAt;
				void updatedAt;

				// memberCount 계산
				const memberCount = memberList.length;

				const imminentQuizbook =
					await this.makeImminentQuizbook(groupQuizbookList);

				return {
					...filteredFields,
					memberCount,
					imminentQuizbook,
				};
			}),
		);

		return transformedGroups;
	}

	async getGroupInfo(userId: string, groupId: string) {
		const group = await this.groupRepository.findById(groupId);

		if (!group)
			throw new NotFoundException(
				`해당 ${groupId} Group을 찾을 수 없습니다.`,
			);

		const { memberList, groupQuizbookList, updatedAt, ...filteredFields } =
			group.toObject();

		void updatedAt;

		if (!memberList.map((user) => user._id.toString()).includes(userId))
			throw new UnauthorizedException(`허가되지 않는 접근입니다.`);

		const imminentQuizbook =
			await this.makeImminentQuizbook(groupQuizbookList);

		return {
			...filteredFields,
			memberList,
			imminentQuizbook,
		};
	}

	async postCreateGroup(userId: string, request: CreateGroupDto) {
		return this.databaseService.runInDefaultTransaction(async (session) => {
			const data = { ...request, admin: toObjectId(userId) };

			const newGroup = await this.groupRepository.create(data, session);

			const memberData = { memberList: [toObjectId(userId)] };

			await this.groupRepository.update(
				memberData,
				(newGroup._id as Types.ObjectId).toString(),
				session,
			);

			// ChatRoom 생성 코드 추후에 추가.

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
		await this.databaseService.runInDefaultTransaction(async (session) => {
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

			// Group에 속한 모든 GroupQuizbook 제거 코드 추후에 추가.
			// ChatRoom 제거 코드 추후에 추가.

			const deletedGroup = await this.groupRepository.delete(
				groupId,
				session,
			);

			if (!deletedGroup)
				throw new NotFoundException(
					`해당 ${groupId} Group을 삭제할 수 없습니다.`,
				);
		});
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

		// 추후 url 수정 필요.
		return { url: `http://localhost:3000/auth/login?token=${token}` };
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

		await this.groupRepository.update(
			{
				$addToSet: { memberList: userId }, // 중복 없이 배열에 userId 추가
			},
			groupId,
		);

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

		await this.groupRepository.update(
			{ $pull: { memberList: memberId } },
			groupId,
		);
	}
}
