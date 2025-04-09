import { Injectable } from '@nestjs/common';
import { LikeRepository } from './like.repository';
import { toggleQuizbookLikeDto } from './dto/toggle-quizbook-like.dto';
import { toggleQuizLikeDto } from './dto/toggle-quiz-like.dto';

@Injectable()
export class LikeService {
	constructor(private readonly likeRepo: LikeRepository) {}

	// 특정 Quizbook의 찜 상태 변경
	async toggleQuizbookLike(dto: toggleQuizbookLikeDto, userId: string) {
		const { quizbookId } = dto;
		const like = await this.likeRepo.findByOwner(userId);

		// 1. 찜 목록이 없는 경우
		if (!like) {
			await this.likeRepo.addQuizbook(quizbookId, userId);

			return { state: true };
		}

		const likedCheck = like.quizbookList.some(
			(id) => String(id) === quizbookId,
		);

		// 2. 찜 목록에 해당 Quizbook이 이미 포함된 경우
		if (likedCheck) {
			await this.likeRepo.removeQuizbook(quizbookId, userId);

			return { state: false };
		}

		// 3. 찜 목록에 해당 Quizbook이 포함이 안된 경우
		await this.likeRepo.addQuizbook(quizbookId, userId);

		return { state: true };
	}

	// 특정 Quiz의 찜 상태 변경
	async toggleQuizLike(dto: toggleQuizLikeDto, userId: string) {
		const { quizId } = dto;

		const like = await this.likeRepo.findByOwner(userId);

		// 1. 찜 목록이 없는 경우
		if (!like) {
			await this.likeRepo.addQuiz(quizId, userId);

			return { state: true };
		}

		const likedCheck = like.quizList.some((id) => String(id) === quizId);

		// 2. 찜 목록에 해당 Quiz가 이미 포함된 경우
		if (likedCheck) {
			await this.likeRepo.removeQuiz(quizId, userId);

			return { state: false };
		}

		// 3. 찜 목록에 해당 Quiz가 포함이 안된 경우
		await this.likeRepo.addQuiz(quizId, userId);

		return { state: true };
	}

	// 사용자의 찜한 Quizbook 목록 조회
	async findOneByOwnerWithQuizbookList(userId: string) {
		return this.likeRepo.findByOwnerWithQuizbookList(userId);
	}

	// 사용자의 찜한 Quiz 목록 조회
	async findOneByOwnerWithQuizList(userId: string) {
		return this.likeRepo.findByOwnerWithQuizList(userId);
	}
}
