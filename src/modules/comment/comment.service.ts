import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentRepository } from './comment.repository';
import { toObjectId } from 'src/common/utils/database.util';
import { DatabaseService } from 'src/database/database.service';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
	constructor(
		private readonly databaseService: DatabaseService,
		private readonly commentRepo: CommentRepository,
	) {}

	// Comment 생성
	async createComment(dto: CreateCommentDto, userId: string) {
		// 최상위 댓글인 경우
		if (!dto.commentId) {
			const comment = await this.commentRepo.create({
				content: dto.content,
				quiz: toObjectId(dto.quizId),
				author: toObjectId(userId),
			});

			return comment;
		}

		// ReComment 인 경우
		// 1. 상위 Comment 존재 유/무 확인
		const topComment = await this.commentRepo.findOneById(dto.commentId);

		if (!topComment)
			throw new NotFoundException(
				`상위 ${dto.commentId} Comment를 찾을 수 없습니다.`,
			);

		// 트랜잭션 적용
		return this.databaseService.runInDefaultTransaction(async (session) => {
			const comment = await this.commentRepo.create(
				{
					depth: topComment.depth + 1,
					content: dto.content,
					quiz: toObjectId(dto.quizId),
					author: toObjectId(userId),
				},
				session,
			);

			// 상위 Comment의 replies 업데이트
			await this.commentRepo.updateByRecomment(
				dto.commentId as string,
				comment._id as string,
				session,
			);

			return comment;
		});
	}

	// 특정 Quiz에 대한 모든 최상위 Comment 조회
	async getCommentList(quizId: string) {
		return this.commentRepo.findAll(quizId);
	}

	// 특정 Comment 상세 조회
	async getCommentDetail(commentId: string) {
		return this.commentRepo.findOneByIdWithDetail(commentId);
	}

	// 사용자가 작성한 모든 Comment 조회
	async getCommentListByUserId(userId: string) {
		return this.commentRepo.findOneByUserId(userId);
	}

	// 특정 Comment 수정
	async updateComment(
		dto: UpdateCommentDto,
		commentId: string,
		userId: string,
	) {
		// 1. Comment 유/무 확인
		const comment = await this.commentRepo.findOneById(commentId, userId);

		if (!comment)
			throw new NotFoundException(
				`해당 ${commentId} Comment를 찾을 수 없거나 author이 아닙니다.`,
			);

		// 2. Comment 수정
		const updated = await this.commentRepo.update(dto, commentId, userId);

		return updated;
	}

	// 특정 Comment 삭제
	async removeComment(commentId: string, userId: string) {
		// 1. Comment 유/무 확인
		const comment = await this.commentRepo.findOneById(commentId, userId);

		if (!comment)
			throw new NotFoundException(
				`해당 ${commentId} Comment를 찾을 수 없거나 author이 아닙니다.`,
			);

		// 2-1. ReComment가 없는 경우(Hard Delete)
		if (!(comment.replies.length > 0)) {
			await this.commentRepo.deleteHard(commentId, userId);

			return;
		}

		// 2-2. ReComment가 존재하는 경우 (Soft Delete)
		await this.commentRepo.deleteSoft(commentId, userId);
	}
}
