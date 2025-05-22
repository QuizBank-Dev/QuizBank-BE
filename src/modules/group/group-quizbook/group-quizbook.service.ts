import {
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { GroupQuizbookRepository } from './group-quizbook.repository';
import { DatabaseService } from 'src/database/database.service';
import { GroupRepository } from '../group.repository';
import { toObjectId } from 'src/common/utils/database.util';
import { GroupQuizbookQueryDto } from './dto/group-quizbook-query.dto';
import { GroupQuizbook } from './schema/group-quizbook.schema';
import { QuizbookService } from 'src/modules/quizbook/quizbook.service';
import { Quizbook } from 'src/modules/quizbook/schema/quizbook.schema';
import { Types } from 'mongoose';

@Injectable()
export class GroupQuizbookService {
	constructor(
		private readonly groupQuizbookRepository: GroupQuizbookRepository,
		private readonly databaseService: DatabaseService,
		private readonly groupRepository: GroupRepository,
		private readonly quizbookService: QuizbookService,
	) {}

	async getGroupQuizbookList(
		userId: string,
		groupId: string,
		query: GroupQuizbookQueryDto,
	) {
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

		const { standard, cursor, limit, status, sort } = query;

		const groupQuizbookList =
			await this.groupQuizbookRepository.findGroupQuizbookList(
				toObjectId(groupId),
				new Date(standard),
				limit,
				status,
				sort,
				cursor ? new Date(cursor) : undefined,
			);

		const resultGroupQuizbookList = await Promise.all(
			groupQuizbookList.map(async (data: GroupQuizbook) => {
				return {
					_id: data._id,
					group: data.group,
					quizbook: await this.quizbookService.addUserFlagsToQuizbook(
						data.quizbook as Quizbook,
						userId,
					),
					endedAt: data.endedAt,
				};
			}),
		);

		const leftCount = await this.groupQuizbookRepository.findLeftCount(
			toObjectId(groupId),
			new Date(standard),
			status,
			sort,
			cursor ? new Date(cursor) : undefined,
		);

		return {
			list: resultGroupQuizbookList,
			nextCursor:
				resultGroupQuizbookList.length > 0
					? resultGroupQuizbookList[
							resultGroupQuizbookList.length - 1
						].endedAt
					: null,
			leftCount: leftCount - resultGroupQuizbookList.length,
		};
	}

	async getGroupQuizbook(
		userId: string,
		groupId: string,
		quizbookId: string,
	) {
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

		const groupQuizbook =
			await this.groupQuizbookRepository.findGroupQuizbook(
				toObjectId(groupId),
				toObjectId(quizbookId),
			);

		if (!groupQuizbook)
			throw new NotFoundException(
				`존재하지 않는 그룹 선정 문제집입니다.`,
			);

		return groupQuizbook;
	}

	async postCreateGroupQuizbook(
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

		const targetGroupQuizbookList = group.groupQuizbookList.map(
			(data: GroupQuizbook) =>
				(data.quizbook as Types.ObjectId).toString(),
		);
		const index = targetGroupQuizbookList.indexOf(quizbookId);
		if (index !== -1)
			throw new ConflictException(`이미 선정된 문제집입니다.`);

		await this.databaseService.runInDefaultTransaction(async (session) => {
			// endDate의 시간 부분을 23:59:59.999로 설정
			const endedAt = new Date(endDate);
			endedAt.setHours(23, 59, 59, 999);

			// 그룹 선정 문제집 생성
			const data = {
				group: toObjectId(groupId),
				quizbook: toObjectId(quizbookId),
				endedAt,
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

		// endDate의 시간 부분을 23:59:59.999로 설정
		const endedAt = new Date(endDate);
		endedAt.setHours(23, 59, 59, 999);

		await this.groupQuizbookRepository.update(
			{ endedAt },
			groupId,
			quizbookId,
		);
	}

	async deleteGroupQuizbook(
		userId: string,
		groupId: string,
		quizbookId: string,
	) {
		const group = await this.groupRepository.findById(groupId);

		if (!group)
			throw new NotFoundException(
				`해당 ${groupId} Group을 찾을 수 없습니다.`,
			);

		if (group.admin._id.toString() !== userId)
			throw new UnauthorizedException(`허가되지 않는 접근입니다.`);

		await this.databaseService.runInDefaultTransaction(async (session) => {
			const deletedGroupQuizbook =
				await this.groupQuizbookRepository.delete(
					groupId,
					quizbookId,
					session,
				);

			if (deletedGroupQuizbook)
				await this.groupRepository.update(
					{ $pull: { groupQuizbookList: deletedGroupQuizbook._id } },
					groupId,
					session,
				);
		});
	}
}
