import { Injectable } from '@nestjs/common';
import { LikeRepository } from './like.repository';
import { toggleQuizbookLikeDto } from './dto/toggle-quizbook-like.dto';
import { toggleQuizLikeDto } from './dto/toggle-quiz-like.dto';
import { QuizbookService } from '../quizbook/quizbook.service';
import { Types } from 'mongoose';
import { QuizService } from '../quiz/quiz.service';
import { PaginationRequestDto } from 'src/common/dto/pagination.dto';
import { Quizbook } from '../quizbook/schema/quizbook.schema';
import { Quiz } from '../quiz/schema/quiz.schema';

@Injectable()
export class LikeService {
	constructor(
		private readonly likeRepo: LikeRepository,
		private readonly quizbookService: QuizbookService,
		private readonly quizService: QuizService,
	) {}

	// 특정 Quizbook의 찜 상태 변경
	async toggleQuizbookLike(dto: toggleQuizbookLikeDto, userId: string) {
		const { quizbookId } = dto;

		// 1. 찜 여부 확인
		const likedCheck = await this.likeRepo.existsQuizbookLike(
			quizbookId,
			userId,
		);

		// 2. 이미 찜한 경우
		if (likedCheck) {
			await this.likeRepo.removeQuizbook(quizbookId, userId);

			return { state: false };
		}

		// 3. 찜하기
		await this.likeRepo.addQuizbook(quizbookId, userId);

		return { state: true };
	}

	// 특정 Quiz의 찜 상태 변경
	async toggleQuizLike(dto: toggleQuizLikeDto, userId: string) {
		const { quizId } = dto;

		// 1. 찜 여부 확인
		const likedCheck = await this.likeRepo.existsQuizLike(quizId, userId);

		// 2. 이미 찜한 경우
		if (likedCheck) {
			await this.likeRepo.removeQuiz(quizId, userId);

			return { state: false };
		}

		// 3. 찜하기
		await this.likeRepo.addQuiz(quizId, userId);

		return { state: true };
	}

	// 사용자의 찜한 Quizbook 목록 조회
	async getQuizbookLikeListByUser(dto: PaginationRequestDto, userId: string) {
		// 1. 찜한 목록 조회
		const pagedLikedList =
			await this.likeRepo.findQuizbookLikeListByOwnerWithPagination(
				userId,
				dto,
			);

		// 2. 찜한 Id 목록
		const likedIdList = pagedLikedList.data.map((quizbook) =>
			(quizbook._id as Types.ObjectId).toString(),
		);

		// 3. 응답 가공
		const result = await this.quizbookService.addUserFlagsToQuizbook(
			pagedLikedList.data as Quizbook[],
			userId,
			{ likedIdList },
		);

		return {
			data: result,
			nextCursor: pagedLikedList.nextCursor,
			totalCount: pagedLikedList.totalCount,
		};
	}

	// 사용자의 찜한 Quiz 목록 조회
	async getQuizLikeListByUser(dto: PaginationRequestDto, userId: string) {
		// 1. 찜한 목록 조회
		const pagedLikedList =
			await this.likeRepo.findQuizLikeListByOwnerWithPagination(
				userId,
				dto,
			);

		// 2. 찜한 Id 목록
		const likedIdList = pagedLikedList.data.map((quiz) =>
			(quiz._id as Types.ObjectId).toString(),
		);

		// 3. 응답 가공
		const result = await this.quizService.addUserFlagsToQuiz(
			pagedLikedList.data as Quiz[],
			userId,
			likedIdList,
		);

		return {
			data: result,
			nextCursor: pagedLikedList.nextCursor,
			totalCount: pagedLikedList.totalCount,
		};
	}
}
