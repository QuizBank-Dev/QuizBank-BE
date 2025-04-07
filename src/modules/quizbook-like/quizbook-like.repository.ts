import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuizbookLike } from './schema/quizbook-like.schema';
import { DB_TYPE } from 'src/database/database.const';
import { Model } from 'mongoose';
import { toObjectId } from 'src/common/utils/database.util';

@Injectable()
export class QuizbookLikeRepository {
	constructor(
		@InjectModel(QuizbookLike.name, DB_TYPE.DEFAULT)
		private readonly quizbookLikeModel: Model<QuizbookLike>,
	) {}

	/**
	 * 찜 목록에 Quizbook을 추가
	 */
	async addQuizbook(quizbookId: string, userId: string) {
		return this.quizbookLikeModel.findOneAndUpdate(
			{ owner: toObjectId(userId) },
			{ $addToSet: { quizbookList: toObjectId(quizbookId) } },
			{ new: true, upsert: true },
		);
	}

	/**
	 * 찜 목록에 Quizbook을 제거
	 */
	async removeQuizbook(quizbookId: string, userId: string) {
		return this.quizbookLikeModel.findOneAndUpdate(
			{ owner: toObjectId(userId) },
			{ $pull: { quizbookList: toObjectId(quizbookId) } },
			{ new: true },
		);
	}

	/**
	 * 찜 목록 단순 조회
	 */
	async findByOwner(userId: string) {
		return this.quizbookLikeModel.findOne({ owner: toObjectId(userId) });
	}

	/**
	 * 짐 목록 조회
	 * populate(quizbookList)
	 */
	async findByOwnerWithQuizbookList(userId: string) {
		return this.quizbookLikeModel
			.findOne({ owner: toObjectId(userId) })
			.populate({ path: 'quizbookList', model: 'Quizbook' });
	}

	/**
	 * 찜 목록 제거
	 */
	async remove(userId: string) {
		return this.quizbookLikeModel.findOneAndDelete({
			owner: toObjectId(userId),
		});
	}
}
