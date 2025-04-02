import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GroupQuizbookService } from './group-quizbook.service';
import { ApiBaseResponse } from 'src/common/decorators/base-response.decorator';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { GroupQuizbookExample } from './group-quizbook.example';

@Controller({ path: 'group/:groupId/quizbook', version: '1' })
@ApiTags('GroupQuizbook')
export class GroupQuizbookController {
	constructor(private readonly groupQuizbookService: GroupQuizbookService) {}

	@Get()
	@ApiOperation({
		summary: '그룹의 선정 문제집 목록 조회',
		description: '그룹의 선정 문제집 목록을 조회합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '조회 성공', [GroupQuizbookExample])
	getAllGroupQuizbook(
		@UserId() userId: string,
		@Param('groupId') groupId: string,
	) {
		return this.groupQuizbookService.getAllGroupQuizbook(userId, groupId);
	}
}
