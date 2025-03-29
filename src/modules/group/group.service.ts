import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { QuizbookRepository } from '../quizbook/quizbook.repository';
import { GroupQuizbook } from './schema/group-quizbook.schema';

@Injectable()
export class GroupService {
	constructor(
		private readonly groupRepository: GroupRepository,
		private readonly quizbookRepository: QuizbookRepository,
	) {}

	async getAllBelongedGroup(userId: string) {
		const groupList =
			await this.groupRepository.findAllBelongedGroupById(userId);

		// 그룹 정보를 변환
		const transformedGroups = groupList.map(async (group) => {
			const { memberList, groupQuizbookList, ...filteredFields } =
				group.toObject();

			// memberCount 계산
			const memberCount = memberList.length;

			// imminentQuizbook 계산: endedAt이 오늘 이후인 문제집 중 가장 가까운 날짜를 찾음
			const today = new Date();
			const year = today.getFullYear();
			const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
			const day = String(today.getDate()).padStart(2, '0');
			const todayDate = new Date(`${year}-${month}-${day}`);
			const quizbookList = groupQuizbookList
				.filter(
					(quizbook: GroupQuizbook) => quizbook.endedAt >= todayDate,
				) // 오늘 이후만 포함
				.sort(
					(a: GroupQuizbook, b: GroupQuizbook) =>
						new Date(a.endedAt).getTime() -
						new Date(b.endedAt).getTime(),
				) as GroupQuizbook[];

			let imminentQuizbook = {};

			if (quizbookList.length !== 0) {
				const targetId = quizbookList[0].quizbook.toString();
				const targetQuizbook =
					await this.quizbookRepository.findById(targetId);

				if (!targetQuizbook)
					throw new NotFoundException(
						`해당 ${targetId} Quizbook을 찾을 수 없습니다.`,
					);

				imminentQuizbook = targetQuizbook;
			}

			return {
				...filteredFields,
				memberCount,
				imminentQuizbook,
			};
		});

		return transformedGroups;
	}
}
