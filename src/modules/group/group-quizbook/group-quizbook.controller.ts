import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GroupQuizbookService } from './group-quizbook.service';
import { ApiBaseResponse } from 'src/common/decorators/base-response.decorator';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { GroupQuizbookExample } from './group-quizbook.example';
import { CreateGroupQuizbookDto } from './dto/create-group-quizbook.dto';

@Controller({ path: 'group/:groupId/quizbook', version: '1' })
@ApiTags('GroupQuizbook')
export class GroupQuizbookController {
	constructor(private readonly groupQuizbookService: GroupQuizbookService) {}

	@Get()
	@ApiOperation({
		summary: 'Group의 선정 문제집 목록 조회',
		description: 'Group의 선정 문제집 목록을 조회합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '조회 성공', [GroupQuizbookExample])
	getAllGroupQuizbook(
		@UserId() userId: string,
		@Param('groupId') groupId: string,
	) {
		return this.groupQuizbookService.getAllGroupQuizbook(userId, groupId);
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
}
