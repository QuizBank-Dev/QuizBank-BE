import { Injectable, NotFoundException } from '@nestjs/common';
import { StudyRepository } from './study.repository';
import { SubmitStudyDto } from './dto/submit-study.dto';
import { ClientSession, Types } from 'mongoose';
import { Quiz, QuizType } from '../quiz/schema/quiz.schema';
import { DatabaseService } from 'src/database/database.service';
import { QuizRecord } from './schema/quiz-record.schema';
import { toObjectId } from 'src/common/utils/database.util';
import { QuizbookRepository } from '../quizbook/quizbook.repository';
import { LikeRepository } from '../like/like.repository';
import { StudyLogRepository } from '../study-log/study-log.repository';
import { PaginationRequestDto } from 'src/common/dto/pagination.dto';
import { GroupRepository } from '../group/group.repository';
import { getXpByType, isCorrect, isWrong } from './utils/study.utils';
import { AIService } from '../ai/ai.service';
import { QuizRepository } from '../quiz/quiz.repository';
import { CategoryType } from '../quizbook/schema/quizbook.schema';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class StudyService {
	constructor(
		private readonly studyRepo: StudyRepository,
		private readonly quizRepo: QuizRepository,
		private readonly quizbookRepo: QuizbookRepository,
		private readonly likeRepo: LikeRepository,
		private readonly studyLogRepo: StudyLogRepository,
		private readonly groupRepo: GroupRepository,
		private readonly userRepo: UserRepository,
		private readonly aiService: AIService,
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
			for (const quiz of quizbook.quizList as Quiz[]) {
				const quizId = (quiz._id as Types.ObjectId).toString();

				const answer = answerList.find(
					(a) => a.quizId === quizId,
				)?.answer;

				const score = answer
					? await this.calculateScore(
							quiz,
							quizbook.category,
							answer,
							session,
						)
					: 0;

				totalScore += score;

				const quizRecord = await this.studyRepo.createQuizRecord(
					{
						answer,
						score,
						quiz: quiz._id as Types.ObjectId,
						owner: toObjectId(userId),
						type: quiz.type,
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
			await this.studyLogRepo.upsert(
				quizRecordList.length,
				userId,
				session,
			);

			// 7. 사용자의 experience 증가
			await this.userRepo.update(
				userId,
				{ $inc: { experience: totalScore } },
				session,
			);
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
		const likedSet = new Set(
			await this.likeRepo.findQuizLikeIdListByOwner(userId),
		);

		// 3. 응답 가공
		const quizList = (quizbookRecord.quizRecordList as QuizRecord[]).map(
			(quizRecord) => ({
				_id: (quizRecord.quiz as Partial<Quiz>)._id,
				question: (quizRecord.quiz as Partial<Quiz>).question,
				type: (quizRecord.quiz as Partial<Quiz>).type,
				score: quizRecord.score,
				isLiked: likedSet.has(
					(
						(quizRecord.quiz as Partial<Quiz>)._id as Types.ObjectId
					).toString(),
				),
			}),
		);

		return {
			quizbook: quizbookRecord.quizbook,
			quizList,
			createdAt: quizbookRecord.createdAt,
			updatedAt: quizbookRecord.updatedAt,
		};
	}

	/**
	 * 특정 Quiz에 대한 사용자들 답안 조회
	 */
	async getQuizRecordOfAnswerList(
		dto: PaginationRequestDto,
		quizId: string,
		userId: string,
	) {
		// 1. 사용자의 QuizRecord 조회
		const quizRecord = await this.studyRepo.findQuizRecordByUser(
			quizId,
			userId,
		);

		// 2. 다른 사용자들의 QuizRecord 조회
		const result = await this.studyRepo.findQuizRecordListWithPagination(
			quizId,
			userId,
			dto,
		);

		//3. 응답 가공
		const answerList = result.data.map((record) => ({
			answer: record.answer,
			score: record.score,
			owner: record.owner,
		}));

		const data =
			quizRecord && !dto.cursor
				? [
						{
							answer: quizRecord.answer,
							score: quizRecord.score,
							owner: quizRecord.owner,
						},
						...answerList,
					]
				: answerList;

		return {
			data,
			nextCursor: result.nextCursor,
			totalCount: quizRecord ? result.totalCount + 1 : result.totalCount,
		};
	}

	/**
	 * 특정 Quiz에 대한 Group멤버들의 답안 조회
	 */
	async getQuizRecordOfAnswerListByGroup(
		quizId: string,
		groupId: string,
		userId: string,
	) {
		const group = await this.groupRepo.findOneById(groupId, userId);
		if (!group)
			throw new NotFoundException(
				`해당 ${groupId}의 Group이 존재하지 않거나 멤버가 아닙니다.`,
			);

		const result = await this.studyRepo.findQuizRecordListByUserList(
			quizId,
			userId,
			group.memberList,
		);

		return result.map((record) => {
			return {
				answer: record.answer,
				score: record.score,
				owner: record.owner,
			};
		});
	}

	/**
	 * 특정 Quizbook에 대한 Group멤버들의 점수 조회
	 */
	async getQuizRecordOfScoreListByGroup(
		quizbookId: string,
		groupId: string,
		userId: string,
	) {
		const group = await this.groupRepo.findOneByIdWithUser(groupId, userId);
		if (!group)
			throw new NotFoundException(
				`해당 ${groupId}의 Group이 존재하지 않거나 멤버가 아닙니다.`,
			);

		const result = await this.studyRepo.findQuizbookRecordListByUserList(
			quizbookId,
			group.memberList,
		);

		return {
			meberList: group.memberList,
			scoreList: result.map((record) => {
				return {
					score: record.score,
					owner: record.owner,
				};
			}),
		};
	}

	/**
	 * 답안 채점 메서드
	 * @param quiz Quiz 모델
	 * @param category Quizbook 카테고리
	 * @param answer 사용자 답안
	 * @param session DB 세션
	 * @returns number 점수
	 */
	private async calculateScore(
		quiz: Quiz,
		category: CategoryType,
		answer: string,
		session: ClientSession,
	) {
		if (!answer.trim()) return 0;

		// OX && 객관식
		if ([QuizType.OX, QuizType.MULTIPLE_CHOICE].includes(quiz.type)) {
			return quiz.answer === answer ? getXpByType(quiz.type) : 0;
		}

		// 주관식
		if (QuizType.SHORT_ANSWER === quiz.type) {
			// 1. 모범답안 및 유사답안 확인
			if (isCorrect(quiz, answer)) return getXpByType(quiz.type);

			// 2. 오답안 확인
			if (isWrong(quiz, answer)) return 0;

			// 3. AI 채점
			const score = await this.aiService.gradeWithAI(
				quiz,
				category,
				answer,
			);

			// 4. 정답 여부 확인
			const xp = getXpByType(quiz.type);

			if (score === xp)
				await this.quizRepo.updateSimilarList(
					(quiz._id as Types.ObjectId).toString(),
					answer,
					session,
				);
			else
				await this.quizRepo.updateWrongList(
					(quiz._id as Types.ObjectId).toString(),
					answer,
					session,
				);

			return score;
		}

		// 서술형
		return this.aiService.gradeWithAI(quiz, category, answer);
	}
}
