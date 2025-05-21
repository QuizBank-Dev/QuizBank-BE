import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GroupQuizbookService } from './group-quizbook.service';
import { ApiBaseResponse } from 'src/common/decorators/base-response.decorator';
import { UserId } from 'src/common/decorators/user-id.decorator';
import {
	GroupQuizbookExample,
	GroupQuizbookListExample,
} from './group-quizbook.example';
import { CreateGroupQuizbookDto } from './dto/create-group-quizbook.dto';
import { GroupQuizbookQueryDto } from './dto/group-quizbook-query.dto';

@Controller({ path: 'group/:groupId/quizbook', version: '1' })
@ApiTags('GroupQuizbook')
export class GroupQuizbookController {
	constructor(private readonly groupQuizbookService: GroupQuizbookService) {}

	@Get()
	@ApiOperation({
		summary: 'Group의 선정 문제집 목록 조회',
		description: 'Group의 선정 문제집 목록을 조회합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '조회 성공', GroupQuizbookListExample)
	getGroupQuizbookList(
		@UserId() userId: string,
		@Param('groupId') groupId: string,
		@Query() query: GroupQuizbookQueryDto,
	) {
		return this.groupQuizbookService.getGroupQuizbookList(
			userId,
			groupId,
			query,
		);
	}

	@Get(':quizbookId')
	@ApiOperation({
		summary: '특정 Group 선정 문제집 정보 조회',
		description: '특정 Group 선정 문제집 정보를 조회합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '조회 성공', GroupQuizbookExample)
	getGroupQuizbook(
		@UserId() userId: string,
		@Param('groupId') groupId: string,
		@Param('quizbookId') quizbookId: string,
	) {
		return this.groupQuizbookService.getGroupQuizbook(
			userId,
			groupId,
			quizbookId,
		);
	}

	@Post(':quizbookId')
	@ApiOperation({
		summary: 'Group 문제집 선정',
		description: 'Group 문제집을 선정합니다.',
	})
	@ApiBaseResponse(201, '선정 성공')
	async postCreateGroupQuizbook(
		@UserId() userId: string,
		@Param('groupId') groupId: string,
		@Param('quizbookId') quizbookId: string,
		@Body() request: CreateGroupQuizbookDto,
	) {
		await this.groupQuizbookService.postCreateGroupQuizbook(
			userId,
			groupId,
			quizbookId,
			request.endDate,
		);
	}

	@Patch(':quizbookId')
	@ApiOperation({
		summary: 'Group 선정 문제집 마감일 수정',
		description: 'Group 선정 문제집 마감일을 수정합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '수정 성공')
	async patchGroupQuizbookEndDate(
		@UserId() userId: string,
		@Param('groupId') groupId: string,
		@Param('quizbookId') quizbookId: string,
		@Body() request: CreateGroupQuizbookDto,
	) {
		await this.groupQuizbookService.patchGroupQuizbookEndDate(
			userId,
			groupId,
			quizbookId,
			request.endDate,
		);
	}

	@Delete(':quizbookId')
	@ApiOperation({
		summary: 'Group 선정 문제집 삭제',
		description: 'Group 선정 문제집을 삭제합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '삭제 성공')
	async deleteGroupQuizbook(
		@UserId() userId: string,
		@Param('groupId') groupId: string,
		@Param('quizbookId') quizbookId: string,
	) {
		await this.groupQuizbookService.deleteGroupQuizbook(
			userId,
			groupId,
			quizbookId,
		);
	}
}
