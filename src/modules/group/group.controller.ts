import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBaseResponse } from 'src/common/decorators/base-response.decorator';
import {
	allBelongedGroupExample,
	GroupIdExample,
	GroupInfoExample,
} from './group.example';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { CreateGroupDto } from './dto/create-group.dto';

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

	@Post()
	@ApiOperation({
		summary: 'Group 생성',
		description: '새로운 Group을 생성합니다.',
	})
	@ApiBaseResponse(201, '생성 성공', GroupIdExample)
	postCreateGroup(@UserId() userId: string, @Body() request: CreateGroupDto) {
		return this.groupService.postCreateGroup(userId, request);
	}

	@Patch(':groupId')
	@ApiOperation({
		summary: 'Group 정보 수정',
		description: 'Group 정보를 수정합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '수정 성공')
	async patchUpadteGroup(
		@UserId() userId: string,
		@Param('groupId') groupId: string,
		@Body() request: CreateGroupDto,
	) {
		await this.groupService.patchUpdateGroup(userId, groupId, request);
	}

	@Delete(':groupId')
	@ApiOperation({
		summary: 'Group 삭제',
		description: 'Group을 삭제합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '삭제 성공')
	async deleteGroup(
		@UserId() userId: string,
		@Param('groupId') groupId: string,
	) {
		await this.groupService.deleteGroup(userId, groupId);
	}

	@Patch(':groupId/owner')
	@ApiOperation({
		summary: '그룹장 위임',
		description: '그룹장 권한을 위임합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '위임 성공')
	async patchGroupOwner(
		@UserId() userId: string,
		@Param('groupId') groupId: string,
		@Body() request: { memberId: string },
	) {
		await this.groupService.patchGroupOwner(
			userId,
			groupId,
			request.memberId,
		);
	}

	@Delete(':groupId/member/:memberId')
	@ApiOperation({
		summary: '그룹원 강퇴',
		description: '그룹원을 강퇴합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '강퇴 성공')
	async deleteGroupMember(
		@UserId() userId: string,
		@Param('groupId') groupId: string,
		@Param('memberId') memberId: string,
	) {
		await this.groupService.deleteGroupMember(userId, groupId, memberId);
	}
}
