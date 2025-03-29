import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schema/review.schema';
import { DB_TYPE } from 'src/database/database.const';
import { ClientSession, isValidObjectId, Model } from 'mongoose';
import { toObjectId } from 'src/common/utils/database.util';

@Injectable()
export class ReviewRepository {
	constructor(
		@InjectModel(Review.name, DB_TYPE.DEFAULT)
		private readonly reviewModel: Model<Review>,
	) {}

	/**
	 * Review 생성
	 */
	async create(data: Partial<Review>, session?: ClientSession) {
		return new this.reviewModel(data).save({ session });
	}

	/**
	 * 특정 Quizbook의 모든 Review 조회
	 * (비로그인 사용자)
	 */
	async findAll(quizbookId: string) {
		return this.reviewModel
			.find({ quizbook: toObjectId(quizbookId) })
			.sort({ createdAt: -1 })
			.populate({
				path: 'author',
				model: 'User',
				select: 'nickname profileImg',
			});
	}

	/**
	 * 특정 Quizbook의 모든 Review 조회
	 * (사용자 제외)
	 */
	async findAllWithoutUser(quizbookId: string, userId: string) {
		return this.reviewModel
			.find({
				quizbook: toObjectId(quizbookId),
				author: { $ne: toObjectId(userId) },
			})
			.sort({ createdAt: -1 })
			.populate({
				path: 'author',
				model: 'User',
				select: 'nickname profileImg',
			});
	}

	/**
	 * 사용자가 작성한 특정 Quizbook의 Review 조회
	 */
	async findByUser(quizbookId: string, userId: string) {
		return this.reviewModel
			.findOne({
				quizbook: toObjectId(quizbookId),
				author: toObjectId(userId),
			})
			.populate({
				path: 'author',
				model: 'User',
				select: 'nickname profileImg',
			});
	}

	/**
	 * 특정 Review 조회
	 * (reviewId, userId)
	 */
	async findOneById(reviewId: string, userId: string) {
		if (!isValidObjectId(reviewId)) return false;

		return this.reviewModel.findOne({
			_id: reviewId,
			author: toObjectId(userId),
		});
	}

	/**
	 * 특정 Review 조회
	 * (quizbookId, userId)
	 */
	async findOnebyQuizbookId(quizbookId: string, userId: string) {
		if (!isValidObjectId(quizbookId)) return false;

		return this.reviewModel.findOne({
			quizbook: toObjectId(quizbookId),
			author: toObjectId(userId),
		});
	}

	/**
	 * Review 수정
	 */
	async update(
		data: Partial<Review>,
		reviewId: string,
		userId: string,
		session?: ClientSession,
	) {
		return this.reviewModel.findOneAndUpdate(
			{
				_id: reviewId,
				author: toObjectId(userId),
			},
			data,
			{ session, new: true },
		);
	}

	/**
	 * 특정 Review 삭제 (Hard)
	 */
	async removeHard(
		reviewId: string,
		userId: string,
		session?: ClientSession,
	) {
		return this.reviewModel.findOneAndDelete(
			{
				_id: reviewId,
				author: toObjectId(userId),
			},
			{ session },
		);
	}

	/**
	 * 특정 Review 삭제 (Soft)
	 */
	async removeSoft(
		reviewId: string,
		userId: string,
		session?: ClientSession,
	) {
		return this.reviewModel.findOneAndUpdate(
			{
				_id: reviewId,
				author: toObjectId(userId),
			},
			{
				content: '삭제된 리뷰 입니다.',
				deletedAt: new Date(),
			},
			{ session },
		);
	}
}
