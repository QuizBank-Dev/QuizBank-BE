import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DB_TYPE } from 'src/database/database.const';
import { Model, Types } from 'mongoose';
import { toObjectId } from 'src/common/utils/database.util';
import { QuizbookLike } from './schema/quizbook-like.schema';
import { QuizLike } from './schema/quiz-like.schema';
import { PaginationRequestDto } from 'src/common/dto/pagination.dto';
import { pagination } from 'src/common/utils/pagination.util';

@Injectable()
export class LikeRepository {
	constructor(
		@InjectModel(QuizbookLike.name, DB_TYPE.DEFAULT)
		private readonly quizbookLikeModel: Model<QuizbookLike>,
		@InjectModel(QuizLike.name, DB_TYPE.DEFAULT)
		private readonly quizLikeModel: Model<QuizLike>,
	) {}

	/**
	 * Quizbook 찜
	 */
	async addQuizbook(quizbookId: string, userId: string) {
		return new this.quizbookLikeModel({
			quizbook: toObjectId(quizbookId),
			owner: toObjectId(userId),
		}).save();
	}

	/**
	 * Quizbook 찜 해제
	 */
	async removeQuizbook(quizbookId: string, userId: string) {
		return this.quizbookLikeModel
			.findOneAndDelete({
				quizbook: toObjectId(quizbookId),
				owner: toObjectId(userId),
			})
			.lean();
	}

	/**
	 * Quiz 찜
	 */
	async addQuiz(quizId: string, userId: string) {
		return new this.quizLikeModel({
			quiz: toObjectId(quizId),
			owner: toObjectId(userId),
		}).save();
	}

	/**
	 * Quiz 찜 해제
	 */
	async removeQuiz(quizId: string, userId: string) {
		return this.quizLikeModel
			.findOneAndDelete({
				quiz: toObjectId(quizId),
				owner: toObjectId(userId),
			})
			.lean();
	}

	/**
	 * 특정 Quizbook 찜 여부 확인
	 */
	async existsQuizbookLike(quizbookId: string, userId: string) {
		return this.quizbookLikeModel
			.exists({
				quizbook: toObjectId(quizbookId),
				owner: toObjectId(userId),
			})
			.then(Boolean);
	}

	/**
	 * 특정 Quiz 찜 여부 확인
	 */
	async existsQuizLike(quizId: string, userId: string) {
		return this.quizLikeModel
			.exists({
				quiz: toObjectId(quizId),
				owner: toObjectId(userId),
			})
			.then(Boolean);
	}

	/**
	 * 찜한 quizbookId 목록 조회
	 */
	async findQuizbookLikeIdListByOwner(userId: string) {
		const quizbookLikeList = await this.quizbookLikeModel
			.find({ owner: toObjectId(userId) })
			.lean();

		return quizbookLikeList.map((quizbookLike: QuizbookLike) =>
			(quizbookLike.quizbook as Types.ObjectId).toString(),
		);
	}

	/**
	 * 찜한 quizId 목록 조회
	 */
	async findQuizLikeIdListByOwner(userId: string) {
		const quizLikeList = await this.quizLikeModel
			.find({ owner: toObjectId(userId) })
			.lean();

		return quizLikeList.map((quizLike) =>
			(quizLike.quiz as Types.ObjectId).toString(),
		);
	}

	/**
	 * 찜한 Quizbook 목록 조회
	 */
	async findQuizbookLikeListByOwnerWithPagination(
		userId: string,
		{ cursor, limit }: PaginationRequestDto,
	) {
		const result = await pagination({
			model: this.quizbookLikeModel,
			filter: { owner: toObjectId(userId) },
			cursor,
			limit,
			sortOption: { _id: -1 },
			populate: {
				path: 'quizbook',
				model: 'Quizbook',
				populate: {
					path: 'author',
					model: 'User',
					select: 'nickname profileImg',
				},
			},
		});

		return {
			data: result.data.map((quizbookLike) => ({
				...quizbookLike.quizbook,
			})),
			nextCursor: result.nextCursor,
			totalCount: result.totalCount,
		};
	}

	/**
	 * 찜한 Quiz 목록 조회
	 */
	async findQuizLikeListByOwnerWithPagination(
		userId: string,
		{ cursor, limit }: PaginationRequestDto,
	) {
		const result = await pagination({
			model: this.quizLikeModel,
			filter: { owner: toObjectId(userId) },
			cursor,
			limit,
			sortOption: { _id: -1 },
			populate: {
				path: 'quiz',
				model: 'Quiz',
			},
		});

		return {
			data: result.data.map((quizLike) => ({
				...quizLike.quiz,
			})),
			nextCursor: result.nextCursor,
			totalCount: result.totalCount,
		};
	}
}
