import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DB_TYPE } from 'src/database/database.const';
import { Comment } from './schema/comment.schema';
import { ClientSession, FilterQuery, Model } from 'mongoose';
import { toObjectId } from 'src/common/utils/database.util';
import { PaginationRequestDto } from 'src/common/dto/pagination.dto';
import { pagination } from 'src/common/utils/pagination.util';

@Injectable()
export class CommentRepository {
	constructor(
		@InjectModel(Comment.name, DB_TYPE.DEFAULT)
		private readonly commentModel: Model<Comment>,
	) {}

	/**
	 * Comment 생성
	 */
	async create(data: Partial<Comment>, session?: ClientSession) {
		return new this.commentModel(data).save({ session });
	}

	/**
	 * 특정 Comment 조회
	 */
	async findById(commentId: string, userId?: string) {
		const filter: FilterQuery<Comment> = {
			_id: commentId,
		};

		if (userId) filter.author = toObjectId(userId);

		return this.commentModel.findById(filter).lean();
	}

	/**
	 * 특정 Comment 조회
	 * populate: author
	 */
	async findByIdWithAuthor(commentId: string) {
		return this.commentModel
			.findById(commentId)
			.populate({
				path: 'author',
				model: 'User',
				select: 'nickname profileImg',
			})
			.lean();
	}

	/**
	 * 특정 Quiz에 대한 모든 최상위 Comment 조회
	 */
	async findListWithPagination(
		quizId: string,
		{ cursor, limit }: PaginationRequestDto,
	) {
		return pagination({
			model: this.commentModel,
			filter: { quiz: toObjectId(quizId), parent: null },
			cursor,
			limit,
			sortOption: { _id: -1 },
			populate: {
				path: 'author',
				model: 'User',
				select: 'nickname profileImg',
			},
		});
	}

	/**
	 * 특정 Comment에 대한 Recomment 조회
	 */
	async findListByParentWithPagination(
		commentId: string,
		{ cursor, limit }: PaginationRequestDto,
	) {
		return pagination({
			model: this.commentModel,
			filter: { parent: toObjectId(commentId) },
			cursor,
			limit,
			sortOption: { _id: -1 },
			populate: {
				path: 'author',
				model: 'User',
				select: 'nickname profileImg',
			},
		});
	}

	/**
	 * 특정 Comment에 대한 Recomment 유/무 확인
	 */
	async existsRecomment(commentId: string) {
		return this.commentModel
			.exists({ parent: toObjectId(commentId) })
			.then(Boolean);
	}

	/**
	 * 특정 Comment에 대한 Recomment 갯수 조회
	 */
	async countRecommentList(commentId: string) {
		return this.commentModel.countDocuments({
			parent: toObjectId(commentId),
		});
	}

	/**
	 * 사용자가 작성한 모든 Comment 조회
	 */
	async findListByUserWithPagination(
		userId: string,
		{ cursor, limit }: PaginationRequestDto,
	) {
		return pagination({
			model: this.commentModel,
			filter: { author: toObjectId(userId) },
			cursor,
			limit,
			sortOption: { _id: -1 },
		});
	}

	/**
	 * 특정 Comment 수정
	 */
	async update(data: Partial<Comment>, commentId: string, userId: string) {
		return this.commentModel
			.findOneAndUpdate(
				{
					_id: commentId,
					author: toObjectId(userId),
				},
				data,
				{ new: true },
			)
			.lean();
	}

	/**
	 * 특정 Comment 삭제(Hard)
	 */
	async deleteHard(commentId: string, userId: string) {
		return this.commentModel.findOneAndDelete({
			_id: commentId,
			author: toObjectId(userId),
		});
	}

	/**
	 * 특정 Comment 삭제(Soft)
	 */
	async deleteSoft(commentId: string, userId: string) {
		return this.commentModel
			.findOneAndUpdate(
				{ _id: commentId, author: toObjectId(userId) },
				{
					content: '삭제된 댓글입니다.',
					deletedAt: new Date(),
				},
			)
			.lean();
	}
}
