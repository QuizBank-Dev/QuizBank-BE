import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuizbookDto } from './dto/create-quizbook.dto';
import { GetQuizbookListDto } from './dto/get-quizbook-list.dto';
import { Quizbook } from './schema/quizbook.schema';
import { Types } from 'mongoose';
import { QuizRepository } from '../quiz/quiz.repository';
import { QuizbookRepository } from './quizbook.repository';
import { DatabaseService } from 'src/database/database.service';
import { toObjectId } from 'src/common/utils/database.util';
import { LikeRepository } from '../like/like.repository';
import { StudyRepository } from '../study/study.repository';
import { PaginationRequestDto } from 'src/common/dto/pagination.dto';
import { QuizType } from '../quiz/schema/quiz.schema';
import { AIService } from '../ai/ai.service';
import { getXpByType } from '../study/utils/study.utils';

@Injectable()
export class QuizbookService {
	constructor(
		private readonly quizRepo: QuizRepository,
		private readonly quizbookRepo: QuizbookRepository,
		private readonly likeRepo: LikeRepository,
		private readonly studyRepo: StudyRepository,
		private readonly aiService: AIService,
		private readonly databaseService: DatabaseService,
	) {}
	// Quizbook 생성
	async createQuizbook(dto: CreateQuizbookDto, userId: string) {
		// 트랜잭션 적용
		return this.databaseService.runInDefaultTransaction(async (session) => {
			// 1. Quiz 생성
			const quizList = await Promise.all(
				dto.quizList.map(async (data) => {
					if (data.type === QuizType.LONG_ANSWER) {
						data.answer =
							await this.aiService.checkModelAnswerWithAI(
								dto.category,
								data.question,
								data.answer,
							);
					}
					const quiz = await this.quizRepo.create(data, session);

					return quiz;
				}),
			);

			const totalScore = quizList.reduce(
				(acc, val) => acc + getXpByType(val.type),
				0,
			);

			// 2. Quizbook 생성
			const quizbook = await this.quizbookRepo.create(
				{
					...dto,
					quizList: quizList.map((q) => toObjectId(q._id as string)),
					totalScore,
					author: toObjectId(userId),
				},
				session,
			);

			return quizbook;
		});
	}

	// QuizbookList 조회
	async getQuizbookList(dto: GetQuizbookListDto, userId?: string) {
		// 1. 모든 QuizbookList 조회
		const quizbookList =
			await this.quizbookRepo.findListByfilterWithPagination(dto);

		// 2. 미인증 사용자
		if (!userId)
			return {
				...quizbookList,
				data: await this.addUserFlagsToQuizbook(quizbookList.data),
			};

		// 3. 인증 사용자
		return {
			...quizbookList,
			data: await this.addUserFlagsToQuizbook(quizbookList.data, userId),
		};
	}

	// 특정 사용자가 작성한 모든 Quizbook 조회
	async getQuizbookListByUser(dto: PaginationRequestDto, userId: string) {
		const quizbookList =
			await this.quizbookRepo.findQuizbookListByAuthorWithPagination(
				userId,
				dto,
			);

		return {
			...quizbookList,
			data: await this.addUserFlagsToQuizbook(quizbookList.data, userId),
		};
	}

	// isLiked, isStudied 필드 추가 메서드
	async addUserFlagsToQuizbook(
		data: Partial<Quizbook> | Partial<Quizbook>[],
		userId?: string,
		options?: { likedIdList?: string[]; studiedIdList?: string[] },
	) {
		const isArray = Array.isArray(data);
		const quizbookList = isArray ? data : [data];

		if (!userId) {
			const result = quizbookList.map((quizbook) => ({
				...quizbook,
				isLiked: false,
				isStudied: false,
			}));

			return isArray ? result : result[0];
		}

		const likedSet = options?.likedIdList
			? new Set(options.likedIdList)
			: userId
				? new Set(
						await this.likeRepo.findQuizbookLikeIdListByOwner(
							userId,
						),
					)
				: null;

		const studiedSet = options?.studiedIdList
			? new Set(options.studiedIdList)
			: userId
				? new Set(
						(
							await this.studyRepo.findQuizbookRecordByOwnerAndQuizbookList(
								quizbookList.map(
									(quizbook) =>
										quizbook._id as Types.ObjectId,
								),
								userId,
							)
						).map((record) =>
							(record.quizbook as Types.ObjectId).toString(),
						),
					)
				: null;

		const result = quizbookList.map((quizbook) => {
			const id = (quizbook._id as Types.ObjectId).toString();

			return {
				...quizbook,
				...(likedSet && { isLiked: likedSet.has(id) }),
				...(studiedSet && { isStudied: studiedSet.has(id) }),
			};
		});

		return isArray ? result : result[0];
	}

	// 특정 Quizbook의 메타데이터 조회
	async getQuizbookMetaData(quizbookId: string) {
		return this.quizbookRepo.findQuizbookWithMetaData(quizbookId);
	}

	// 특정 Quizbook의 isLiked, isStudied 상태 조회
	async getQuizbookUserFlags(quizbookId: string, userId: string) {
		const exists = await this.quizbookRepo.exists(quizbookId);

		if (!exists)
			throw new NotFoundException(
				`해당 ${quizbookId} Quizbook을 찾을 수 없습니다.`,
			);

		return this.addUserFlagsToQuizbook(
			{ _id: toObjectId(quizbookId) },
			userId,
		);
	}

	// 특정 Quizbook의 통계 데이터 조회
	async getQuizbookStates(quizbookId: string) {
		return this.quizbookRepo.findQuizbookWithStates(quizbookId);
	}
}
