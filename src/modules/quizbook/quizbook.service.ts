import {
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateQuizbookDto } from './dto/create-quizbook.dto';
import { FindAllQuizbookDto } from './dto/find-all-quizbook.dto';
import { Quizbook } from './schema/quizbook.schema';
import { FilterQuery } from 'mongoose';
import { QuizRepository } from '../quiz/quiz.repository';
import { QuizbookRepository } from './quizbook.repository';
import { DatabaseService } from 'src/database/database.service';
import { toObjectId } from 'src/common/utils/database.util';

@Injectable()
export class QuizbookService {
	constructor(
		@Inject(forwardRef(() => QuizRepository))
		private readonly quizRepo: QuizRepository,
		private readonly quizbookRepo: QuizbookRepository,
		private readonly databaseService: DatabaseService,
	) {}
	// Quizbook 생성
	async createQuizbook(dto: CreateQuizbookDto, userId: string) {
		// 트랜잭션 적용
		return this.databaseService.runInDefaultTransaction(async (session) => {
			// 1. Quiz 생성
			const quizList = await Promise.all(
				dto.quizList.map((data) => this.quizRepo.create(data, session)),
			);

			// 2. Quizbook 생성
			const quizbook = await this.quizbookRepo.create(
				{
					...dto,
					quizList: quizList.map((q) => toObjectId(q._id as string)),
					author: toObjectId(userId),
				},
				session,
			);

			return quizbook;
		});
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

	// 특정 Quizbook 상세 조회
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
