import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like } from './schema/like.schema';
import { DB_TYPE } from 'src/database/database.const';
import { Model } from 'mongoose';
import { toObjectId } from 'src/common/utils/database.util';

@Injectable()
export class LikeRepository {
	constructor(
		@InjectModel(Like.name, DB_TYPE.DEFAULT)
		private readonly likeModel: Model<Like>,
	) {}

	/**
	 * 찜 목록에 Quizbook 추가
	 */
	async addQuizbook(quizbookId: string, userId: string) {
		return this.likeModel.findOneAndUpdate(
			{ owner: toObjectId(userId) },
			{ $addToSet: { quizbookList: toObjectId(quizbookId) } },
			{ new: true, upsert: true },
		);
	}

	/**
	 * 찜 목록에서 Quizbook 제거
	 */
	async removeQuizbook(quizbookId: string, userId: string) {
		return this.likeModel.findOneAndUpdate(
			{ owner: toObjectId(userId) },
			{ $pull: { quizbookList: toObjectId(quizbookId) } },
			{ new: true },
		);
	}

	/**
	 * 찜 목록에 Quiz 추가
	 */
	async addQuiz(quizId: string, userId: string) {
		return this.likeModel.findOneAndUpdate(
			{ owner: toObjectId(userId) },
			{
				$addToSet: { quizList: toObjectId(quizId) },
				$setOnInsert: { createdAt: new Date() },
			},
			{ new: true, upsert: true },
		);
	}

	/**
	 * 찜 목록에서 Quiz 제거
	 */
	async removeQuiz(quizId: string, userId: string) {
		return this.likeModel.findOneAndUpdate(
			{ owner: toObjectId(userId) },
			{ $pull: { quizList: toObjectId(quizId) } },
			{ new: true },
		);
	}

	/**
	 * 찜 목록 단순 조회
	 */
	async findByOwner(userId: string) {
		return this.likeModel.findOne({ owner: toObjectId(userId) });
	}

	/**
	 * 찜 목록 조회(quizbook)
	 * populate(quizbookList)
	 */
	async findByOwnerWithQuizbookList(userId: string) {
		return this.likeModel
			.findOne({ owner: toObjectId(userId) })
			.select('-quizList')
			.populate({ path: 'quizbookList', model: 'Quizbook' });
	}

	/**
	 * 찜 목록 조회(quiz)
	 * populate(quizList)
	 */
	async findByOwnerWithQuizList(userId: string) {
		return this.likeModel
			.findOne({ owner: toObjectId(userId) })
			.select('-quizbookList')
			.populate({ path: 'quizList', model: 'Quiz' });
	}

	/**
	 * 찜 목록 Document 제거
	 */
	async remove(userId: string) {
		return this.likeModel.findOneAndDelete({
			owner: toObjectId(userId),
		});
	}
}
