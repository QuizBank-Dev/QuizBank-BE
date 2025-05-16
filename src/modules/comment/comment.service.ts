import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentRepository } from './comment.repository';
import { toObjectId } from 'src/common/utils/database.util';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginationRequestDto } from 'src/common/dto/pagination.dto';
import { Types } from 'mongoose';

@Injectable()
export class CommentService {
	constructor(private readonly commentRepo: CommentRepository) {}

	// Comment 생성
	async createComment(dto: CreateCommentDto, userId: string) {
		// 최상위 Comment인 경우
		if (!dto.commentId) {
			await this.commentRepo.create({
				content: dto.content,
				quiz: toObjectId(dto.quizId),
				author: toObjectId(userId),
			});

			return;
		}

		// Recomment 인 경우
		const topComment = await this.commentRepo.findById(dto.commentId);
		if (!topComment)
			throw new NotFoundException(
				`상위 ${dto.commentId} Comment를 찾을 수 없습니다.`,
			);

		const comment = await this.commentRepo.create({
			parent: toObjectId(dto.commentId),
			content: dto.content,
			quiz: toObjectId(dto.quizId),
			author: toObjectId(userId),
		});

		return comment;
	}

	// 특정 Quiz에 대한 모든 최상위 Comment 조회
	async getCommentList(dto: PaginationRequestDto, quizId: string) {
		const result = await this.commentRepo.findListWithPagination(
			quizId,
			dto,
		);

		// Recomment 갯수 조회 및 응답 가공
		const dataWithRecommentCount = await Promise.all(
			result.data.map(async (comment) => {
				const recommentCount =
					await this.commentRepo.countRecommentList(
						(comment._id as Types.ObjectId).toString(),
					);

				return {
					...comment,
					recommentCount,
				};
			}),
		);

		return {
			...result,
			data: dataWithRecommentCount,
		};
	}

	// 특정 Comment 상세 조회
	async getCommentDetail(dto: PaginationRequestDto, commentId: string) {
		// 1. 상위 Comment 조회
		const comment = await this.commentRepo.findByIdWithAuthor(commentId);
		if (!comment)
			throw new NotFoundException(
				`해당 ${commentId} Comment를 찾을 수 없습니다.`,
			);

		// 2. Recomment 목록 조회
		const recommentList =
			await this.commentRepo.findListByParentWithPagination(
				commentId,
				dto,
			);

		return {
			comment,
			recomment: recommentList,
		};
	}

	// 사용자가 작성한 모든 Comment 조회
	async getCommentListByUser(dto: PaginationRequestDto, userId: string) {
		return this.commentRepo.findListByUserWithPagination(userId, dto);
	}

	// 특정 Comment 수정
	async updateComment(
		dto: UpdateCommentDto,
		commentId: string,
		userId: string,
	) {
		// 1. Comment 유/무 확인
		const comment = await this.commentRepo.findById(commentId, userId);

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
		const comment = await this.commentRepo.findById(commentId, userId);

		if (!comment)
			throw new NotFoundException(
				`해당 ${commentId} Comment를 찾을 수 없거나 author이 아닙니다.`,
			);

		// 2. Recomment 유/무 확인
		const exists = await this.commentRepo.existsRecomment(commentId);

		// 2-1. Recomment 무(Hard Delete)
		if (!exists) {
			await this.commentRepo.deleteHard(commentId, userId);

			return;
		}

		// 2-2. Recomment 유(Soft Delete)
		await this.commentRepo.deleteSoft(commentId, userId);
	}
}
