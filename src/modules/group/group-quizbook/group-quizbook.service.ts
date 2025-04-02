import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { GroupQuizbookRepository } from './group-quizbook.repository';
import { QuizbookRepository } from 'src/modules/quizbook/quizbook.repository';
import { DatabaseService } from 'src/database/database.service';
import { GroupRepository } from '../group.repository';

@Injectable()
export class GroupQuizbookService {
	constructor(
		private readonly groupQuizbookRepository: GroupQuizbookRepository,
		private readonly quizbookRepository: QuizbookRepository,
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

		const GroupQuizbookList =
			await this.groupQuizbookRepository.findAllGroupQuizbook(groupId);

		return GroupQuizbookList;
	}
}
