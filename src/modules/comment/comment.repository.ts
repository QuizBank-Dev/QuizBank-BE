import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DB_TYPE } from 'src/database/database.const';
import { Comment } from './schema/comment.schema';
import { ClientSession, Model } from 'mongoose';
import { toObjectId } from 'src/common/utils/database.util';

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
	 * ReComment에 의한 기존 Comment의 replies 수정
	 */
	async updateByRecomment(
		commentId: string,
		reCommentId: string,
		session?: ClientSession,
	) {
		return this.commentModel.findByIdAndUpdate(
			commentId,
			{
				$push: { replies: reCommentId },
			},
			session,
		);
	}

	/**
	 * 특정 Comment 조회
	 * (commentId, userId)
	 * (userId: undefined 인 경우 단순 Comment 조회)
	 */
	async findOneById(commentId: string, userId?: string) {
		// 단순 Comment 조회
		if (!userId) return this.commentModel.findById(commentId);

		// 사용자가 작성한 단일 Comment 조회
		return this.commentModel.findOne({
			_id: commentId,
			author: toObjectId(userId),
		});
	}

	/**
	 * 특정 Comment 상세정보 조회
	 * populate: author, replies
	 */
	async findOneByIdWithDetail(commentId: string) {
		return this.commentModel.findById(commentId).populate([
			{
				path: 'replies',
				model: 'Comment',
				populate: {
					path: 'author',
					model: 'User',
					select: 'nickname profileImg',
				},
			},
			{
				path: 'author',
				model: 'User',
				select: 'nickname profileImg',
			},
		]);
	}

	/**
	 * 특정 Quiz에 대한 모든 최상위 Comment 조회
	 */
	async findAll(quizId: string) {
		return this.commentModel.find({ quiz: toObjectId(quizId), depth: 0 });
	}

	/**
	 * 사용자가 작성한 모든 Comment 조회
	 */
	async findOneByUserId(userId: string) {
		return this.commentModel.find({ author: toObjectId(userId) });
	}

	/**
	 * 특정 Comment 수정
	 */
	async update(data: Partial<Comment>, commentId: string, userId: string) {
		return this.commentModel.findOneAndUpdate(
			{
				_id: commentId,
				author: toObjectId(userId),
			},
			data,
			{ new: true },
		);
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
		return this.commentModel.findOneAndUpdate(
			{ _id: commentId, author: toObjectId(userId) },
			{
				content: '삭제된 댓글입니다.',
				deletedAt: new Date(),
			},
		);
	}
}
