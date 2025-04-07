import { Injectable } from '@nestjs/common';
import { QuizbookLikeRepository } from './quizbook-like.repository';
import { toggleQuizbookLikeDto } from './dto/toggle-quizbook-like.dto';

@Injectable()
export class QuizbookLikeService {
	constructor(private readonly quizbookLikeRepo: QuizbookLikeRepository) {}

	// 특정 Quizbook의 찜 상태 변경
	async toggleQuizbookLike(dto: toggleQuizbookLikeDto, userId: string) {
		const { quizbookId } = dto;
		const quizbookLike = await this.quizbookLikeRepo.findByOwner(userId);

		// 1. 찜 목록이 없는 경우
		if (!quizbookLike) {
			await this.quizbookLikeRepo.addQuizbook(quizbookId, userId);

			return { state: true };
		}

		const likedCheck = quizbookLike.quizbookList.some(
			(id) => String(id) === quizbookId,
		);

		// 2. 찜 목록에 해당 Quizbook이 이미 포함된 경우
		if (likedCheck) {
			await this.quizbookLikeRepo.removeQuizbook(quizbookId, userId);

			return { state: false };
		}

		// 3. 찜 목록에 해당 Quizbook이 포함이 안된 경우
		await this.quizbookLikeRepo.addQuizbook(quizbookId, userId);

		return { state: true };
	}

	// 사용자의 찜 목록 조회
	async findQuizbookLikeByOwner(userId: string) {
		return this.quizbookLikeRepo.findByOwnerWithQuizbookList(userId);
	}
}
