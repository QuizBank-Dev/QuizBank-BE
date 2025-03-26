import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizRepository } from './quiz.repository';

@Injectable()
export class QuizService {
	constructor(private readonly quizRepo: QuizRepository) {}

	// 특정 Quiz 조회
	async getQuizDetail(quizId: string) {
		const quiz = await this.quizRepo.findById(quizId);

		if (!quiz)
			throw new NotFoundException(
				`해당 ${quizId} Quiz를 찾을 수 없습니다.`,
			);

		return quiz;
	}
}
