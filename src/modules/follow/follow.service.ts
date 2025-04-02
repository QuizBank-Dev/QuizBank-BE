import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UserRepository } from '../user/user.repository';
import { toObjectId } from '../../common/utils/database.util';
import { FollowType } from './follow.types';

@Injectable()
export class FollowService {
	constructor(private readonly userRepository: UserRepository) {}

	async getAllFollower(userId: string, type: FollowType) {
		const user = (await this.userRepository.findById(userId))!;
		const filter = await user.populate([
			{
				path: 'following',
				model: 'User',
				select: 'nickname profileImg',
			},
			{
				path: 'follower',
				model: 'User',
				select: 'nickname profileImg',
			},
		]);

		return {
			follower:
				type === 'all' || type === 'follower'
					? filter.follower
					: undefined,
			following:
				type === 'all' || type === 'following'
					? filter.following
					: undefined,
		};
	}

	async follow(userId: string, targetId: string) {
		const target = await this.userRepository.findById(targetId);

		if (!target) {
			throw new NotFoundException(
				`존재하지 않는 사용자입니다. ${targetId}`,
			);
		}

		if (
			(target.follower as Types.ObjectId[]).includes(toObjectId(userId))
		) {
			throw new ConflictException(`이미 구독중인 사용자입니다.`);
		}

		// 구독 처리
		await Promise.all([
			this.userRepository.update(userId, {
				$push: { following: targetId },
			}),
			this.userRepository.update(targetId, {
				$push: { follower: userId },
			}),
		]);
	}

	async removeFollow(
		userId: string,
		targetId: string,
		type: Exclude<FollowType, 'all'>,
	) {
		if (type !== 'following' && type !== 'follower') {
			throw new BadRequestException('type이 제대로 입력되지 않았습니다.');
		}

		// 구독 취소 처리
		await Promise.all([
			this.userRepository.update(userId, {
				$pull: {
					[type === 'following' ? 'following' : 'follower']: targetId,
				},
			}),
			this.userRepository.update(targetId, {
				$pull: {
					[type === 'following' ? 'follower' : 'following']: userId,
				},
			}),
		]);
	}
}
