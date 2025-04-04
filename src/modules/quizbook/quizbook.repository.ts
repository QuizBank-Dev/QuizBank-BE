import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quizbook } from './schema/quizbook.schema';
import { DB_TYPE } from 'src/database/database.const';
import { ClientSession, FilterQuery, isValidObjectId, Model } from 'mongoose';
import { toObjectId } from 'src/common/utils/database.util';

@Injectable()
export class QuizbookRepository {
	constructor(
		@InjectModel(Quizbook.name, DB_TYPE.DEFAULT)
		private readonly quizbookModel: Model<Quizbook>,
	) {}

	/**
	 * Quizbook 생성
	 */
	async create(data: Partial<Quizbook>, session?: ClientSession) {
		return new this.quizbookModel(data).save({ session });
	}

	/**
	 * 필터 조건에 맞는 Quizbook 목록 조회(filter = {}: 전체 목록 조회)
	 * (populate: author)
	 */
	async findAll(filter: FilterQuery<Quizbook>) {
		return this.quizbookModel.find(filter).populate({
			path: 'author',
			model: 'User',
			select: 'nickname profileImg',
		});
	}

	/**
	 * 특정 Quizbook 단순 정보 조회
	 */
	async findById(quizbookId: string) {
		return this.quizbookModel.findById(quizbookId).populate([
			{
				path: 'author',
				model: 'User',
				select: 'nickname profileImg',
			},
		]);
	}

	/**
	 * 특정 Quizbook 상세 조회
	 * (populate: quizList, author)
	 */
	async findByIdWithQuizAndAuthor(quizbookId: string) {
		return this.quizbookModel.findById(quizbookId).populate([
			{
				path: 'quizList',
				model: 'Quiz',
				select: 'type question optionList',
			},
			{
				path: 'author',
				model: 'User',
				select: 'nickname profileImg',
			},
		]);
	}

	/**
	 * 특정 Quizbook의 Review 관련 통계 업데이트
	 * (ex: reviewCount, reviewScore)
	 */
	async updateReviewStats(
		filter: FilterQuery<Quizbook>,
		quizbookId: string,
		session?: ClientSession,
	) {
		return this.quizbookModel.findByIdAndUpdate(quizbookId, filter, {
			session,
		});
	}

	/**
	 * 특정 Quizbook 유/무 확인
	 */
	async exists(quizbookId: string) {
		return this.quizbookModel.exists({ _id: quizbookId }).then(Boolean);
	}

	/**
	 * 사용자가 작성한 모든 Quizbook 조회
	 */
	async findByUser(userId: string) {
		return this.quizbookModel.find({ author: toObjectId(userId) });
	}
}
