import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz } from './schema/quiz.schema';
import { DB_TYPE } from 'src/database/database.const';
import { Model } from 'mongoose';

@Injectable()
export class QuizService {
	constructor(
		@InjectModel(Quiz.name, DB_TYPE.DEFAULT)
		private readonly quizModel: Model<Quiz>,
	) {}

	// 특정 Quiz를 가져온다.
	async findOne(id: string) {
		const quiz = await this.quizModel.findOne({ _id: id });

		if (!quiz)
			throw new NotFoundException(`${id} 문제를 찾을 수 없습니다.`);

		return quiz;
	}
}
