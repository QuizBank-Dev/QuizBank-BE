import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UserRepository } from '../user/user.repository';
import { toObjectId } from '../../common/utils/database.util';
import { FollowType } from './dto/follow-query.dto';

@Injectable()
export class FollowService {
	constructor(private readonly userRepository: UserRepository) {}

	/**
	 * 구독 조회
	 * @param userId
	 * @param type
	 *   - all: `default` follower + following
	 *   - follower: 해당 유저를 팔로우하는 사람
	 *   - following: 해당 유저가 팔로우하는 사람
	 */
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
				type === FollowType.ALL || type === FollowType.FOLLOWER
					? filter.follower
					: undefined,
			following:
				type === FollowType.ALL || type === FollowType.FOLLOWING
					? filter.following
					: undefined,
		};
	}

	/**
	 * 유저 팔로우
	 * @param userId
	 * @param targetId
	 */
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

	/**
	 * 팔로우 취소/팔로워 제거
	 * @param userId
	 * @param targetId
	 * @param type
	 *   - follower: 해당 유저(userId)를 팔로우하는 사람
	 *   - following: 해당 유저(userId)가 팔로우하는 사람
	 */
	async removeFollow(userId: string, targetId: string, type: FollowType) {
		if (type !== FollowType.FOLLOWING && type !== FollowType.FOLLOWER) {
			throw new BadRequestException('type이 제대로 입력되지 않았습니다.');
		}

		// 구독 취소 처리
		return await Promise.all([
			this.userRepository.update(userId, {
				$pull: {
					[type]: targetId,
				},
			}),
			this.userRepository.update(targetId, {
				$pull: {
					[type === FollowType.FOLLOWING
						? FollowType.FOLLOWER
						: FollowType.FOLLOWING]: userId,
				},
			}),
		]);
	}
}
