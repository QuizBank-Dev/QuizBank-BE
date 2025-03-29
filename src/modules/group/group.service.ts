import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { QuizbookRepository } from '../quizbook/quizbook.repository';
import { GroupQuizbook } from './schema/group-quizbook.schema';
import { toObjectId } from 'src/common/utils/database.util';
import { Types } from 'mongoose';

@Injectable()
export class GroupService {
	constructor(
		private readonly groupRepository: GroupRepository,
		private readonly quizbookRepository: QuizbookRepository,
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
		const transformedGroups = groupList.map(async (group) => {
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
		});

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

		if (!memberList.includes(toObjectId(userId)))
			throw new UnauthorizedException(`허가되지 않는 접근입니다.`);

		const imminentQuizbook =
			await this.makeImminentQuizbook(groupQuizbookList);

		return {
			...filteredFields,
			memberList,
			imminentQuizbook,
		};
	}
}
