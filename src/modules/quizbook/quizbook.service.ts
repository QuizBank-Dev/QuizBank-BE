import {
	forwardRef,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { CreateQuizbookDto } from './dto/create-quizbook.dto';
import { FindAllQuizbookDto } from './dto/find-all-quizbook.dto';
import { Quizbook } from './schema/quizbook.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import { DB_TYPE } from 'src/database/database.const';
import { InjectModel } from '@nestjs/mongoose';
import { QuizRepository } from '../quiz/quiz.repository';
import { QuizbookRepository } from './quizbook.repository';

@Injectable()
export class QuizbookService {
	constructor(
		@InjectModel(Quizbook.name, DB_TYPE.DEFAULT)
		private readonly quizbookModel: Model<Quizbook>,
		@Inject(forwardRef(() => QuizRepository))
		private readonly quizRepo: QuizRepository,
		private readonly quizbookRepo: QuizbookRepository,
	) {}
	// Quizbook 생성
	async createQuizbook(dto: CreateQuizbookDto, userId: string) {
		// 1. 트랜젝션 시작
		const session = await this.quizbookModel.db.startSession();
		session.startTransaction();

		try {
			// 2. Quiz 생성
			const quizList = await Promise.all(
				dto.quizList.map((data) => this.quizRepo.create(data, session)),
			);

			// 3. Quizbook 생성
			const quizbook = await this.quizbookRepo.create(
				{
					...dto,
					quizList: quizList.map((q) => q._id) as Types.ObjectId[],
					author: new Types.ObjectId(userId),
				},
				session,
			);

			// 4-1. 트랜젝션 커밋
			await session.commitTransaction();

			return quizbook;
		} catch (e) {
			// 4-2. 오류 발생시 롤백
			await session.abortTransaction();

			throw new InternalServerErrorException(
				'Quizbook의 DB Document 생성 도중 에러가 발생했습니다.',
			);
		} finally {
			// 5. 트랜젝션 종료
			await session.endSession();
		}
	}

	// 모든 Quizbook 조회
	async getQuizbookList(query: FindAllQuizbookDto) {
		const { keyword } = query;
		const filters: FilterQuery<Quizbook> = {};

		if (keyword) {
			const regex = new RegExp(keyword, 'i');
			filters.$or = [
				{ title: { $regex: regex } },
				{ description: { $regex: regex } },
				{ category: { $regex: regex } },
			];
		}

		const quizbookList = await this.quizbookRepo.findAll(filters);

		return quizbookList;
	}

	// 특정 Quizbook을 조회
	async getQuizbookDetail(quizbookId: string) {
		const quizbook =
			await this.quizbookRepo.findByIdWithQuizAndAuthor(quizbookId);

		if (!quizbook)
			throw new NotFoundException(
				`해당 ${quizbookId} Quizbook을 찾을 수 없습니다.`,
			);

		return quizbook;
	}
}
