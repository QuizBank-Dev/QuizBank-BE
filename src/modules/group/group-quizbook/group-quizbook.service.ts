import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { GroupQuizbookRepository } from './group-quizbook.repository';
import { DatabaseService } from 'src/database/database.service';
import { GroupRepository } from '../group.repository';
import { toObjectId } from 'src/common/utils/database.util';

@Injectable()
export class GroupQuizbookService {
	constructor(
		private readonly groupQuizbookRepository: GroupQuizbookRepository,
		private readonly databaseService: DatabaseService,
		private readonly groupRepository: GroupRepository,
	) {}

	async getAllGroupQuizbook(userId: string, groupId: string) {
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

		const groupQuizbookList =
			await this.groupQuizbookRepository.findAllGroupQuizbook(groupId);

		return groupQuizbookList;
	}

	async postCreateGroupQuizbook(
		userId: string,
		groupId: string,
		quizbookId: string,
		endDate: Date,
	) {
		await this.databaseService.runInDefaultTransaction(async (session) => {
			const group = await this.groupRepository.findById(groupId);

			if (!group)
				throw new NotFoundException(
					`해당 ${groupId} Group을 찾을 수 없습니다.`,
				);

			if (group.admin._id.toString() !== userId)
				throw new UnauthorizedException(`허가되지 않는 접근입니다.`);

			// 그룹 선정 문제집 생성
			const data = {
				group: toObjectId(groupId),
				quizbook: toObjectId(quizbookId),
				endedAt: endDate,
			};
			const newGroupQuizbook = await this.groupQuizbookRepository.create(
				data,
				session,
			);

			// 그룹 수정
			await this.groupRepository.update(
				{
					$addToSet: { groupQuizbookList: newGroupQuizbook._id }, // 중복 없이 배열에 newGroupQuizbookId 추가
				},
				groupId,
				session,
			);
		});
	}

	async patchGroupQuizbookEndDate(
		userId: string,
		groupId: string,
		quizbookId: string,
		endDate: Date,
	) {
		const group = await this.groupRepository.findById(groupId);

		if (!group)
			throw new NotFoundException(
				`해당 ${groupId} Group을 찾을 수 없습니다.`,
			);

		if (group.admin._id.toString() !== userId)
			throw new UnauthorizedException(`허가되지 않는 접근입니다.`);

		await this.groupQuizbookRepository.update(
			{ endedAt: endDate },
			groupId,
			quizbookId,
		);
	}

	async deleteGroupQuizbook(
		userId: string,
		groupId: string,
		quizbookId: string,
	) {
		await this.databaseService.runInDefaultTransaction(async (session) => {
			const group = await this.groupRepository.findById(groupId);

			if (!group)
				throw new NotFoundException(
					`해당 ${groupId} Group을 찾을 수 없습니다.`,
				);

			if (group.admin._id.toString() !== userId)
				throw new UnauthorizedException(`허가되지 않는 접근입니다.`);

			const deletedGroupQuizbook =
				await this.groupQuizbookRepository.delete(
					groupId,
					quizbookId,
					session,
				);

			if (!deletedGroupQuizbook)
				throw new NotFoundException(
					'Group의 해당 선정 문제집을 찾을 수 없습니다.',
				);

			await this.groupRepository.update(
				{ $pull: { groupQuizbookList: deletedGroupQuizbook._id } },
				groupId,
				session,
			);
		});
	}
}
