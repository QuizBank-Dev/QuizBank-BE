import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuizbookRecord } from './schema/quizbook-record.schema';
import { DB_TYPE } from 'src/database/database.const';
import { ClientSession, Model, Types } from 'mongoose';
import { QuizRecord } from './schema/quiz-record.schema';
import { toObjectId } from 'src/common/utils/database.util';
import { PaginationRequestDto } from 'src/common/dto/pagination.dto';
import { pagination } from 'src/common/utils/pagination.util';

@Injectable()
export class StudyRepository {
	constructor(
		@InjectModel(QuizbookRecord.name, DB_TYPE.DEFAULT)
		private readonly quizbookRecordModel: Model<QuizbookRecord>,
		@InjectModel(QuizRecord.name, DB_TYPE.DEFAULT)
		private readonly quizRecordModel: Model<QuizRecord>,
	) {}

	/**
	 * QuizRecord 생성
	 * 특정 Quizbook에 대한 각 Quiz의 Study 기록
	 */
	async createQuizRecord(data: Partial<QuizRecord>, session?: ClientSession) {
		return new this.quizRecordModel(data).save({ session });
	}

	/**
	 * QuizRecord 연쇄 삭제
	 * (quizRecordId를 통한 다중 삭제)
	 */
	async deleteManyQuizRecordsByIdList(
		quizRecordIdList: Types.ObjectId[],
		session?: ClientSession,
	) {
		if (quizRecordIdList.length === 0) return;

		if (!session) {
			await this.quizRecordModel.deleteMany({
				_id: { $in: quizRecordIdList },
			});

			return;
		}

		await this.quizRecordModel
			.deleteMany({
				_id: { $in: quizRecordIdList },
			})
			.session(session);
	}

	/**
	 * QuizbookRecord 생성 또는 수정
	 * 특정 Quizbook에 대한 통합 Study 기록
	 */
	async upsertQuizbookRecord(
		data: Partial<QuizbookRecord>,
		session?: ClientSession,
	) {
		return this.quizbookRecordModel
			.updateOne(
				{ quizbook: data.quizbook, owner: data.owner },
				{
					$set: {
						...data,
						updatedAt: new Date(),
					},
					$setOnInsert: {
						createdAt: new Date(),
					},
				},
				{ upsert: true, session, new: true },
			)
			.lean();
	}

	/**
	 * 특정 Quizbook들에 대한 사용자의 QuizbookRecord 조회
	 * (isStudied 판단할 때 사용)
	 */
	async findQuizbookRecordByOwnerAndQuizbookList(
		quizbookIdList: Types.ObjectId[],
		userId: string,
	) {
		return this.quizbookRecordModel
			.find({
				owner: toObjectId(userId),
				quizbook: { $in: quizbookIdList },
			})
			.lean();
	}

	/**
	 * QuizbookRecord 조회
	 * (quizbook, user를 통한 조회)
	 */
	async findQuizbookRecord(quizbookId: string, userId: string) {
		return this.quizbookRecordModel
			.findOne({
				quizbook: toObjectId(quizbookId),
				owner: toObjectId(userId),
			})
			.lean();
	}

	/**
	 * QuizbookRecord 상세 조회
	 * quizbook: title, category 포함
	 * quizRecordList: quiz의 question 까지 포함
	 */
	async findQuizbookRecordFull(quizbookId: string, userId: string) {
		return this.quizbookRecordModel
			.findOne({
				quizbook: toObjectId(quizbookId),
				owner: toObjectId(userId),
			})
			.populate({
				path: 'quizRecordList',
				model: 'QuizRecord',
				select: 'answer score quiz',
				populate: {
					path: 'quiz',
					model: 'Quiz',
					select: 'question type',
				},
			})
			.lean();
	}

	/**
	 * 특정 Quiz에 대한 사용자들의 QuizRecord 조회(본인 제외)
	 */
	async findQuizRecordListWithPagination(
		quizId: string,
		userId: string,
		{ cursor, limit }: PaginationRequestDto,
	) {
		return pagination({
			model: this.quizRecordModel,
			filter: {
				quiz: toObjectId(quizId),
				owner: { $ne: toObjectId(userId) },
			},
			cursor,
			limit,
			sortOption: { score: -1, _id: -1 },
			populate: {
				path: 'owner',
				model: 'User',
				select: 'nickname profileImg',
			},
		});
	}

	/**
	 * 특정 Quiz에 대한 사용자의 QuizRecord 조회
	 */
	async findQuizRecordByUser(quizId: string, userId: string) {
		return this.quizRecordModel
			.findOne({ quiz: toObjectId(quizId), owner: toObjectId(userId) })
			.populate({
				path: 'owner',
				model: 'User',
				select: 'nickname profileImg',
			})
			.lean();
	}

	/**
	 * 특정 Quiz에 대한 Group멤버들의 QuizRecord 조회(본인 제외)
	 */
	async findQuizRecordListByUserList(
		quizId: string,
		userId: string,
		userList: Types.ObjectId[],
	) {
		return this.quizRecordModel
			.find({
				quiz: toObjectId(quizId),
				$and: [
					{ owner: { $in: userList } },
					// { owner: { $ne: toObjectId(userId) } },
				],
			})
			.populate({
				path: 'owner',
				model: 'User',
				select: 'nickname profileImg',
			})
			.sort({ score: -1, _id: -1 })
			.lean();
	}

	/**
	 * 특정 Quizbook에 대한 Group멤버들의 QuizbookRecord 조회(본인 포함)
	 */
	async findQuizbookRecordListByUserList(
		quizbookId: string,
		userList: Types.ObjectId[],
	) {
		return this.quizbookRecordModel
			.find({
				quizbook: toObjectId(quizbookId),
				owner: { $in: userList },
			})
			.populate({
				path: 'owner',
				model: 'User',
				select: 'nickname profileImg',
			})
			.sort({ score: -1, _id: -1 })
			.lean();
	}
}
