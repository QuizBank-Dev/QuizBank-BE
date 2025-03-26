import {
	ConflictException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schema/review.schema';
import { DB_TYPE } from 'src/database/database.const';
import { Model, Types } from 'mongoose';
import { QuizbookRepository } from '../quizbook/quizbook.repository';
import { ReviewRepository } from './review.repository';

@Injectable()
export class ReviewService {
	constructor(
		@InjectModel(Review.name, DB_TYPE.DEFAULT)
		private readonly reviewModel: Model<Review>,
		@Inject(forwardRef(() => QuizbookRepository))
		private readonly quizbookRepo: QuizbookRepository,
		private readonly reviewRepo: ReviewRepository,
	) {}

	// Review 생성
	async createReview(dto: CreateReviewDto, userId: string) {
		// 1. 중복 확인
		const existingReview = await this.reviewRepo.findOneById(
			dto.quizbookId,
			userId,
		);

		if (existingReview)
			throw new ConflictException('작성된 Review가 존재합니다.');

		// 2. Review 생성
		const review = await this.reviewRepo.create({
			score: dto.score,
			content: dto.content,
			quizbook: new Types.ObjectId(dto.quizbookId),
			author: new Types.ObjectId(userId),
		});

		return review;
	}

	// 모든 Review 조회
	async getReviewList(quizbookId: string, userId?: string) {
		// 1. Quizbook 유/무 확인
		const existingQuizbook = await this.quizbookRepo.exists(quizbookId);

		if (!existingQuizbook)
			throw new NotFoundException(
				`해당 ${quizbookId} Quizbook을 찾을 수 없습니다.`,
			);

		// 2. 인증된 사용자인 경우
		if (userId) {
			const [userReview, otherReview] = await Promise.all([
				this.reviewRepo.findByUser(quizbookId, userId),
				this.reviewRepo.findAllWithoutUser(quizbookId, userId),
			]);

			return userReview ? [userReview, ...otherReview] : otherReview;
		}

		// 3. 미인증인 경우
		return this.reviewRepo.findAll(quizbookId);
	}

	// 특정 Review 수정
	async update(dto: UpdateReviewDto, reviewId: string, userId: string) {
		// 1. Review 조회
		const review = await this.reviewRepo.findOneById(reviewId, userId);

		if (!review)
			throw new NotFoundException(
				`해당 ${reviewId} Review를 찾을 수 없거나 author이 아닙니다.`,
			);

		const quizbookId = (review.quizbook as Types.ObjectId).toString();
		const prevScore = review.score;

		// 2. Review 업데이트
		const updatedReview = await this.reviewRepo.update(
			dto,
			reviewId,
			userId,
		);

		// 3. Quizbook 업데이트
		const scoreDiff =
			dto.score !== undefined && dto.score !== null
				? dto.score - prevScore
				: 0;
		await this.quizbookRepo.updateReviewStats(
			{
				$inc: { reviewScore: scoreDiff },
			},
			quizbookId,
		);

		return updatedReview;
	}

	// 특정 리뷰를 삭제한다.
	async remove(reviewId: string, userId: string) {
		// 1. Review 조회
		const review = await this.reviewRepo.findOneById(reviewId, userId);

		if (!review)
			throw new NotFoundException(
				`해당 ${reviewId} Review를 찾을 수 없거나 author이 아닙니다.`,
			);

		// 2. Review 삭제
		await this.reviewRepo.remove(reviewId, userId);

		// 3. Quizbook의 Review 관련 필드 업데이트
		await this.quizbookRepo.updateReviewStats(
			{
				$inc: {
					reviewCount: -1,
					reviewScore: -review.score,
				},
			},
			(review.quizbook as Types.ObjectId).toString(),
		);
	}
}
