import { Injectable, NotFoundException } from '@nestjs/common';
import { StudyRepository } from './study.repository';
import { SubmitStudyDto } from './dto/submit-study.dto';
import { QuizbookRepository } from '../quizbook/quizbook.repository';
import { Types } from 'mongoose';
import { Quiz, QuizType } from '../quiz/schema/quiz.schema';
import { DatabaseService } from 'src/database/database.service';
import { QuizRecord, RoleType } from './schema/quiz-record.schema';
import { toObjectId } from 'src/common/utils/database.util';
import { LikeRepository } from '../like/like.repository';
import { Quizbook } from '../quizbook/schema/quizbook.schema';

@Injectable()
export class StudyService {
	constructor(
		private readonly studyRepo: StudyRepository,
		private readonly quizbookRepo: QuizbookRepository,
		private readonly likeRepo: LikeRepository,
		private readonly databaseService: DatabaseService,
	) {}

	// Study 결과 제출
	async submitStudy(dto: SubmitStudyDto, userId: string) {
		const { quizbookId, answerList } = dto;

		const quizbook = await this.quizbookRepo.findByIdWithQuiz(quizbookId);

		if (!quizbook)
			throw new NotFoundException(
				`해당 ${quizbookId} Quizbook을 찾을 수 없습니다.`,
			);

		return this.databaseService.runInDefaultTransaction(async (session) => {
			const quizRecordList: Types.ObjectId[] = [];
			let totalScore = 0;

			// 1. 기존 학습 결과 유/무 조회
			const existingRecord = await this.studyRepo.findQuizbookRecord(
				quizbookId,
				userId,
			);

			// 2. 기존 QuizRecord 삭제
			if (existingRecord)
				await this.studyRepo.deleteManyQuizRecordsByIdList(
					existingRecord.quizRecordList as Types.ObjectId[],
					session,
				);

			// 3. 새로운 QuizRecord 생성
			for (const { quizId, answer } of answerList) {
				const quiz = quizbook.quizList.find(
					(q) => (q._id as Types.ObjectId).toString() === quizId,
				) as Quiz;
				if (!quiz) continue;

				let score = 0;
				// OX, 객관식인 경우
				if (
					[QuizType.OX, QuizType.MULTIPLE_CHOICE].includes(quiz.type)
				) {
					score =
						quiz.answer === answer
							? this.getXpByType(quiz.type)
							: 0;
				} else {
					// 주관식, 서술형인 경우
					score = await this.gradeWithAI(quiz, answer);
				}

				totalScore += score;

				const quizRecord = await this.studyRepo.createQuizRecord(
					{
						role: RoleType.USER,
						answer,
						score,
						quiz: quiz._id as Types.ObjectId,
						owner: toObjectId(userId),
					},
					session,
				);

				quizRecordList.push(quizRecord._id as Types.ObjectId);
			}

			// 4. QuizbookRecord 생성 or 업데이트
			await this.studyRepo.upsertQuizbookRecord(
				{
					quizbook: toObjectId(quizbookId),
					owner: toObjectId(userId),
					quizRecordList,
					score: totalScore,
				},
				session,
			);

			// 5. Quizbook 통계 업데이트
			if (existingRecord) {
				const scoreDiff = totalScore - existingRecord.score;

				await this.quizbookRepo.updateStats(
					{
						$inc: {
							solvedScore: scoreDiff,
						},
					},
					quizbookId,
					session,
				);
			} else {
				await this.quizbookRepo.updateStats(
					{
						$inc: {
							solvedCount: +1,
							solvedScore: +totalScore,
						},
					},
					quizbookId,
					session,
				);
			}

			// 6. 사용자의 Study 기록 추가
		});
	}

	// Study 결과 조회
	async getStudyResult(quizbookId: string, userId: string) {
		// 1. QuizbookRecord 존재 유/무 확인
		const quizbookRecord = await this.studyRepo.findQuizbookRecordFull(
			quizbookId,
			userId,
		);

		if (!quizbookRecord)
			throw new NotFoundException(
				`해당 ${quizbookId} Quibook의 학습 결과가 없습니다.`,
			);

		// 2. 사용자의 Like 리스트 조회
		const likeDocument = await this.likeRepo.findByOwner(userId);
		const likedQuizList = new Set(
			likeDocument?.quizList.map((id) =>
				(id as Types.ObjectId).toString(),
			) ?? [],
		);

		// 3. 응답 가공
		const quizRecordList = (
			quizbookRecord.quizRecordList as QuizRecord[]
		).map((quizRecord) => ({
			_id: quizbookRecord._id,
			quizId: (quizRecord.quiz as Partial<Quiz>)._id,
			question: (quizRecord.quiz as Partial<Quiz>).question,
			type: (quizRecord.quiz as Partial<Quiz>).type,
			score: quizRecord.score,
			isLiked: likedQuizList.has(
				(
					(quizRecord.quiz as Partial<Quiz>)._id as Types.ObjectId
				).toString(),
			),
		}));

		return {
			quizbook: quizbookRecord.quizbook,
			quizRecordList,
			createdAt: quizbookRecord.createdAt,
			updatedAt: quizbookRecord.updatedAt,
		};
	}

	/**
	 * Quiz 타입별 xp 변환 메서드
	 */
	private getXpByType(type: QuizType): number {
		switch (type) {
			case QuizType.OX:
				return 5;
			case QuizType.MULTIPLE_CHOICE:
				return 10;
			case QuizType.SHORT_ANSWER:
				return 15;
			case QuizType.LONG_ANSWER:
				return 20;
			default:
				return 0;
		}
	}

	/**
	 * AI 채점 메서드
	 */
	private async gradeWithAI(quiz: Quiz, answer: string): Promise<number> {
		// 추후 AI 채점 로직으로 대체
		console.log(quiz.answer, answer);
		return quiz.answer === answer ? 10 : 0;
	}
}
