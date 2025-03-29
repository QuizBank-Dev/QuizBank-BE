import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz } from './schema/quiz.schema';
import { DB_TYPE } from 'src/database/database.const';
import { ClientSession, Model } from 'mongoose';

@Injectable()
export class QuizRepository {
	constructor(
		@InjectModel(Quiz.name, DB_TYPE.DEFAULT)
		private readonly quizModel: Model<Quiz>,
	) {}

	/**
	 * Quiz 생성
	 */
	async create(data: Partial<Quiz>, session?: ClientSession) {
		return new this.quizModel(data).save({ session });
	}

	/**
	 * 특정 Quiz 조회
	 */
	async findById(quizId: string) {
		return this.quizModel.findById(quizId);
	}
}
