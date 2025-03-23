import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { CreateQuizbookDto } from './dto/create-quizbook.dto';
import { Quizbook } from './schema/quizbook.schema';
import { FilterQuery, Model } from 'mongoose';
import { DB_TYPE } from 'src/database/database.const';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz } from '../quiz/schema/quiz.schema';
import { FindAllQuizbookDto } from './dto/find-all-quizbook.dto';

@Injectable()
export class QuizbookService {
	constructor(
		@InjectModel(Quizbook.name, DB_TYPE.DEFAULT)
		private readonly quizbookModel: Model<Quizbook>,
		@InjectModel(Quiz.name, DB_TYPE.DEFAULT)
		private readonly quizModel: Model<Quiz>,
	) {}
	// Quizbook을 생성한다.
	async create(createQuizbookDto: CreateQuizbookDto) {
		// 트랜젝션 시작
		const session = await this.quizbookModel.db.startSession();
		session.startTransaction();

		try {
			// 1. Quiz 생성
			const quizDocs = await Promise.all(
				createQuizbookDto.quizList.map((data) => {
					const quiz = new this.quizModel(data);

					return quiz.save({ session });
				}),
			);

			// 2. Quizbook 생성
			const quizbook: Quizbook = new this.quizbookModel({
				title: createQuizbookDto.title,
				category: createQuizbookDto.category,
				description: createQuizbookDto.description,
				quizList: quizDocs.map((quiz) => quiz._id),
			});

			await quizbook.save({ session });

			// 트랜젝션 커밋
			await session.commitTransaction();
			await session.endSession();

			return quizbook;
		} catch (e) {
			// 오류 발생시 롤백
			await session.abortTransaction();
			throw new InternalServerErrorException(
				'DB 데이터 생성 도중 에러가 발생했습니다.',
			);
		}
	}

	// 모든 Quizbook을 가져온다.
	async findAll(query: FindAllQuizbookDto) {
		const filters: FilterQuery<Quizbook> = {};

		if (query.title) filters.title = { $regex: query.title, $options: 'i' };
		if (query.description)
			filters.description = { $regex: query.description, $options: 'i' };
		if (query.category)
			filters.category = { $regex: query.category, $options: 'i' };

		const quizbookList = await this.quizbookModel.find(filters);

		return quizbookList;
	}

	// 특정 Quizbook을 가져온다.
	async findOne(quizbookId: string) {
		const quizbook = await this.quizbookModel
			.findOne({ _id: quizbookId })
			.populate({
				path: 'quizList',
				model: 'Quiz',
				select: 'type question',
			});

		if (!quizbook)
			throw new NotFoundException(
				`${quizbookId} 문제집을 찾을 수 없습니다.`,
			);

		return quizbook;
	}
}
