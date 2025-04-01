import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async getMyInformation(userId: string) {
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
		}

		return {
			_id: user._id,
			nickname: user.nickname,
			profileImg: user.profileImg,
			introduce: user.introduce,
			category: user.category,
			experience: user.experience,
			isOAuthAccount: !!user.oAuth,
		};
	}

	async getUserInformation(userId: string) {
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
		}

		// TODO userId로 해당 유저의 quizbook, record 가져오는 서비스
		const [quizbook, record] = await Promise.all([
			new Promise<string[]>((resolve) => resolve([])),
			new Promise<string[]>((resolve) => resolve([])),
		]);

		return {
			_id: user._id,
			nickname: user.nickname,
			profileImg: user.profileImg,
			introduce: user.introduce,
			experience: user.experience,
			follower: user.follower,
			quizbook,
			record,
		};
	}
}
