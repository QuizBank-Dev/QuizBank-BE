import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quizbook } from './schema/quizbook.schema';
import { DB_TYPE } from 'src/database/database.const';
import { ClientSession, FilterQuery, isValidObjectId, Model } from 'mongoose';

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
	 * Quizbook 전체 조회
	 * (query?: title, description, category)
	 */
	async findAll(filter: FilterQuery<Quizbook>) {
		return this.quizbookModel.find(filter).populate({
			path: 'author',
			model: 'User',
			select: 'ninckname profileImg',
		});
	}

	/**
	 * 특정 Quizbook 조회
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
	 * Quizbook 수정
	 * (Review 관련 필드 업데이트)
	 */
	async updateReviewStats(filter: FilterQuery<Quizbook>, quizbookId: string) {
		return this.quizbookModel.findByIdAndUpdate(quizbookId, filter);
	}

	/**
	 * Quizbook 유/무 확인
	 */
	async exists(quizbookId: string) {
		if (!isValidObjectId(quizbookId)) return false;

		return this.quizbookModel.exists({ _id: quizbookId }).then(Boolean);
	}
}
