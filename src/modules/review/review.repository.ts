import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schema/review.schema';
import { DB_TYPE } from 'src/database/database.const';
import { isValidObjectId, Model } from 'mongoose';

@Injectable()
export class ReviewRepository {
	constructor(
		@InjectModel(Review.name, DB_TYPE.DEFAULT)
		private readonly reviewModel: Model<Review>,
	) {}

	/**
	 * Review 생성
	 */
	async create(data: Partial<Review>) {
		return new this.reviewModel(data).save();
	}

	/**
	 * 모든 Review 조회
	 * (미인증)
	 */
	async findAll(quizbookId: string) {
		return this.reviewModel
			.find({ quizbook: quizbookId })
			.sort({ createdAt: -1 })
			.populate({
				path: 'author',
				model: 'User',
				select: 'nickname profileImg',
			});
	}

	/**
	 * 모든 Review 조회
	 * (사용자 제외)
	 */
	async findAllWithoutUser(quizbookId: string, userId: string) {
		return this.reviewModel
			.find({
				quizbook: quizbookId,
				author: { $ne: userId },
			})
			.sort({ createdAt: -1 })
			.populate({
				path: 'author',
				model: 'User',
				select: 'nickname profileImg',
			});
	}

	/**
	 * 사용자가 작성한 Review 조회
	 */
	async findByUser(quizbookId: string, userId: string) {
		return this.reviewModel
			.findOne({ quizbook: quizbookId, author: userId })
			.populate({
				path: 'author',
				model: 'User',
				select: 'nickname profileImg',
			});
	}

	/**
	 * Review 수정
	 */
	async update(data: Partial<Review>, reviewId: string, userId: string) {
		return this.reviewModel.findOneAndUpdate(
			{
				_id: reviewId,
				author: userId,
			},
			data,
		);
	}

	/**
	 * 특정 Review 조회
	 */
	async findOneById(reviewId: string, userId: string) {
		if (!isValidObjectId(reviewId)) return false;

		const review = await this.reviewModel.findOne({
			_id: reviewId,
			author: userId,
		});

		if (!review) return false;

		return review;
	}

	/**
	 * 특정 Review 삭제
	 */
	async remove(reviewId: string, userId: string) {
		return this.reviewModel.findOneAndDelete({
			_id: reviewId,
			author: userId,
		});
	}
}
