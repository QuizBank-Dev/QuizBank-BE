import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { GroupService } from './group.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBaseResponse } from 'src/common/decorators/base-response.decorator';
import { allBelongedGroupExample, GroupInfoExample } from './group.example';
import { UserId } from 'src/common/decorators/user-id.decorator';

@Controller({ path: 'group', version: '1' })
@ApiTags('Group')
export class GroupController {
	constructor(private readonly groupService: GroupService) {}

	@Get('me')
	@ApiOperation({
		summary: '내가 속한 Group 목록 조회',
		description: '내가 속한 Group 목록을 조회합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '조회 성공', [allBelongedGroupExample])
	getAllBelongedGroup(@UserId() userId: string) {
		return this.groupService.getAllBelongedGroup(userId);
	}

	@Get(':groupId')
	@ApiOperation({
		summary: '특정 Group 정보 조회',
		description: '특정 Group의 정보를 조회합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '조회 성공', GroupInfoExample)
	getGroupInfo(@UserId() userId: string, @Param('groupId') groupId: string) {
		return this.groupService.getGroupInfo(userId, groupId);
	}
}
