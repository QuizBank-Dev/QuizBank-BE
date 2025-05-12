import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quizbook } from './schema/quizbook.schema';
import { DB_TYPE } from 'src/database/database.const';
import { ClientSession, FilterQuery, Model, SortOrder } from 'mongoose';
import { toObjectId } from 'src/common/utils/database.util';
import { PaginationRequestDto } from 'src/common/dto/pagination.dto';
import {
	GetQuizbookListDto,
	QuizbookSortType,
} from './dto/get-quizbook-list.dto';
import { pagination } from 'src/common/utils/pagination.util';

@Injectable()
export class QuizbookRepository {
	constructor(
		@InjectModel(Quizbook.name, DB_TYPE.DEFAULT)
		private readonly quizbookModel: Model<Quizbook>,
	) {}

	/**
	 * Quizbook 생성
	 */
	async create(data: Partial<Quizbook>, session?: ClientSession) {
		return new this.quizbookModel(data).save({ session });
	}

	/**
	 * 필터 조건에 맞는 Quizbook 목록 조회(filter = {}: 전체 목록 조회)
	 * (populate: author)
	 */
	async findListByfilterWithPagination(dto: GetQuizbookListDto) {
		const {
			keyword,
			category,
			sort = QuizbookSortType.CREATED_AT,
			cursor,
			limit,
		} = dto;
		const filter: FilterQuery<Quizbook> = {};
		if (keyword)
			filter.$or = [
				{ title: { $regex: keyword, $options: 'i' } },
				{ description: { $regex: keyword, $options: 'i' } },
			];
		if (category) filter.category = category;

		const sortOption: Record<string, SortOrder> =
			sort === QuizbookSortType.CREATED_AT
				? { _id: -1 }
				: { reviewRating: -1, _id: -1 };

		return pagination({
			model: this.quizbookModel,
			filter,
			cursor,
			limit,
			sortOption,
			populate: {
				path: 'author',
				model: 'User',
				select: 'nickname profileImg',
			},
		});
	}

	/**
	 * 특정 Quizbook 조회
	 */
	async findById(quizbookId: string) {
		return this.quizbookModel.findById(quizbookId).lean();
	}

	/**
	 * 특정 Quizbook 조회
	 * populate: author
	 */
	async findByIdWithAuthor(quizbookId: string) {
		return this.quizbookModel
			.findById(quizbookId)
			.populate([
				{
					path: 'author',
					model: 'User',
					select: 'nickname profileImg',
				},
			])
			.lean();
	}

	/**
	 * 특정 Quizbook 상세 조회
	 * populate: quizList, author
	 */
	async findByIdWithQuizAndAuthor(quizbookId: string) {
		return this.quizbookModel
			.findById(quizbookId)
			.populate([
				{
					path: 'quizList',
					model: 'Quiz',
					select: 'type question optionList',
				},
				{
					path: 'author',
					model: 'User',
					select: 'nickname profileImg',
				},
			])
			.lean();
	}

	/**
	 * 특정 Quizbook 상세 조회
	 * populate: quizList
	 */
	async findByIdWithQuiz(quizbookId: string) {
		return this.quizbookModel
			.findById(quizbookId)
			.populate([
				{
					path: 'quizList',
					model: 'Quiz',
				},
			])
			.lean();
	}

	/**
	 * 특정 Quizbook의 통계 업데이트
	 */
	async updateStats(
		filter: FilterQuery<Quizbook>,
		quizbookId: string,
		session?: ClientSession,
	) {
		return this.quizbookModel
			.findByIdAndUpdate(quizbookId, filter, {
				session,
			})
			.lean();
	}

	/**
	 * 특정 Quizbook 유/무 확인
	 */
	async exists(quizbookId: string) {
		return this.quizbookModel.exists({ _id: quizbookId }).then(Boolean);
	}

	/**
	 * 사용자가 작성한 모든 Quizbook 조회
	 */
	async findQuizbookListByAuthorWithPagination(
		userId: string,
		{ cursor, limit }: PaginationRequestDto,
	) {
		return pagination({
			model: this.quizbookModel,
			filter: {
				author: toObjectId(userId),
			},
			cursor,
			sortOption: { _id: -1 },
			limit,
		});
	}

	/**
	 * 특정 Quizbook의 최소 메타데이터 조회
	 */
	async findQuizbookWithMetaData(quizbookId: string) {
		return this.quizbookModel
			.findById(quizbookId)
			.select('title category description totalScore')
			.lean();
	}
}
