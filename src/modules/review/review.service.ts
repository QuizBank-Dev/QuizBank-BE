import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Types } from 'mongoose';
import { QuizbookRepository } from '../quizbook/quizbook.repository';
import { ReviewRepository } from './review.repository';
import { DatabaseService } from 'src/database/database.service';
import { toObjectId } from 'src/common/utils/database.util';
import { PaginationRequestDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ReviewService {
	constructor(
		private readonly databaseService: DatabaseService,
		private readonly quizbookRepo: QuizbookRepository,
		private readonly reviewRepo: ReviewRepository,
	) {}

	// Review 생성
	async createReview(dto: CreateReviewDto, userId: string) {
		// 1. 중복 확인
		const existingReview = await this.reviewRepo.findOnebyQuizbookId(
			dto.quizbookId,
			userId,
		);

		if (existingReview)
			throw new ConflictException('이미 작성된 Review가 존재합니다.');

		// 트랜잭션 적용
		return this.databaseService.runInDefaultTransaction(async (session) => {
			// 2. Review 생성
			const review = await this.reviewRepo.create({
				score: dto.score,
				content: dto.content,
				quizbook: toObjectId(dto.quizbookId),
				author: toObjectId(userId),
			});

			// 3. 기존 Quizbook 정보 조회
			const quizbook = await this.quizbookRepo.findById(dto.quizbookId);

			if (!quizbook)
				throw new NotFoundException(
					`해당 ${dto.quizbookId} Quizbook을 찾을 수 없습니다.`,
				);

			const reviewCount = quizbook.reviewCount + 1;
			const reviewScore = quizbook.reviewScore + review.score;
			const reviewRating = parseFloat(
				(reviewScore / reviewCount).toFixed(1),
			);

			// 4. Quizbook의 Review 관련 필드 업데이트
			await this.quizbookRepo.updateStats(
				{
					$set: {
						reviewCount,
						reviewScore,
						reviewRating,
					},
				},
				dto.quizbookId,
				session,
			);

			return review;
		});
	}

	// 모든 Review 조회
	async getReviewList(
		dto: PaginationRequestDto,
		quizbookId: string,
		userId?: string,
	) {
		// 1. Quizbook 유/무 확인
		const existingQuizbook = await this.quizbookRepo.exists(quizbookId);

		if (!existingQuizbook)
			throw new NotFoundException(
				`해당 ${quizbookId} Quizbook을 찾을 수 없습니다.`,
			);

		// 2. 인증된 사용자인 경우
		if (userId) {
			const [userReview, pagedOthers] = await Promise.all([
				this.reviewRepo.findByUser(quizbookId, userId),
				this.reviewRepo.findListWithoutUserWithPagination(
					quizbookId,
					userId,
					dto,
				),
			]);

			const data =
				userReview && !dto.cursor
					? [userReview, ...pagedOthers.data]
					: pagedOthers.data;

			return {
				data,
				nextCursor: pagedOthers.nextCursor,
				totalCount: userReview
					? pagedOthers.totalCount + 1
					: pagedOthers.totalCount,
			};
		}

		// 3. 미인증인 경우
		return this.reviewRepo.findListWithPagination(quizbookId, dto);
	}

	// 특정 Review 수정
	async updateReview(dto: UpdateReviewDto, reviewId: string, userId: string) {
		// 1. Review 조회
		const review = await this.reviewRepo.findOneById(reviewId, userId);

		if (!review)
			throw new NotFoundException(
				`해당 ${reviewId} Review를 찾을 수 없거나 author이 아닙니다.`,
			);

		const quizbookId = (review.quizbook as Types.ObjectId).toString();

		// 2. 기존 Quizbook 정보 조회
		const quizbook = await this.quizbookRepo.findById(quizbookId);
		if (!quizbook)
			throw new NotFoundException(
				`해당 ${quizbookId} Quizbook을 찾을 수 없습니다.`,
			);

		const scoreDiff =
			dto.score !== undefined && dto.score !== null
				? dto.score - review.score
				: 0;
		const reviewScore = quizbook.reviewScore + scoreDiff;
		const reviewCount = quizbook.reviewCount;
		const reviewRating =
			reviewCount === 0
				? 0
				: parseFloat((reviewScore / reviewCount).toFixed(1));

		// 트랜잭션 적용
		return this.databaseService.runInDefaultTransaction(async (session) => {
			// 3. Review 업데이트
			await this.reviewRepo.update(dto, reviewId, userId, session);

			// 4. Quizbook의 Review 관련 필드 업데이트
			await this.quizbookRepo.updateStats(
				{
					$set: {
						reviewScore,
						reviewRating,
					},
				},
				quizbookId,
				session,
			);
		});
	}

	// 특정 리뷰를 삭제한다.
	async removeReview(reviewId: string, userId: string) {
		// 1. Review 조회
		const review = await this.reviewRepo.findOneById(reviewId, userId);

		if (!review)
			throw new NotFoundException(
				`해당 ${reviewId} Review를 찾을 수 없거나 author이 아닙니다.`,
			);

		// 2. 기존 Quizbook 정보 조회
		const quizbookId = (review.quizbook as Types.ObjectId).toString();
		const quizbook = await this.quizbookRepo.findById(quizbookId);

		if (!quizbook)
			throw new NotFoundException(
				`해당 ${quizbookId} Quizbook을 찾을 수 없습니다.`,
			);

		const reviewCount = quizbook.reviewCount - 1;
		const reviewScore = quizbook.reviewScore - review.score;
		const reviewRating =
			reviewCount === 0
				? 0
				: parseFloat((reviewScore / reviewCount).toFixed(1));

		// 트랜잭션 적용
		return this.databaseService.runInDefaultTransaction(async (session) => {
			// 2. Review 삭제
			await this.reviewRepo.removeHard(reviewId, userId, session);

			// 3. Quizbook의 Review 관련 필드 업데이트
			await this.quizbookRepo.updateStats(
				{
					$set: {
						reviewCount,
						reviewScore,
						reviewRating,
					},
				},
				(review.quizbook as Types.ObjectId).toString(),
				session,
			);
		});
	}
}
