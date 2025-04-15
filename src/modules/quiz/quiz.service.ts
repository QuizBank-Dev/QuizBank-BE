import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizRepository } from './quiz.repository';
import { Quiz } from './schema/quiz.schema';
import { LikeRepository } from '../like/like.repository';
import { Types } from 'mongoose';

@Injectable()
export class QuizService {
	constructor(
		private readonly quizRepo: QuizRepository,
		private readonly likeRepo: LikeRepository,
	) {}

	// 특정 Quiz 조회
	async getQuizDetail(quizId: string) {
		const quiz = await this.quizRepo.findById(quizId);

		if (!quiz)
			throw new NotFoundException(
				`해당 ${quizId} Quiz를 찾을 수 없습니다.`,
			);

		return quiz;
	}

	// isLiked 필드 추가 메서드
	async addUserFlagsToQuiz(
		data: Quiz | Quiz[],
		userId: string,
		likedIdList?: string[],
	) {
		const isArray = Array.isArray(data);
		const quizList = isArray ? data : [data];

		const likedSet = likedIdList
			? new Set(likedIdList)
			: new Set(await this.likeRepo.findQuizLikeIdListByOwner(userId));

		const result = quizList.map((quiz) => {
			const id = (quiz._id as Types.ObjectId).toString();

			return {
				...quiz,
				...(likedSet && { isLiked: likedSet.has(id) }),
			};
		});

		return isArray ? result : result[0];
	}
}
