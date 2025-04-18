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
import { GroupService } from './group.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBaseResponse } from 'src/common/decorators/base-response.decorator';
import {
	GroupIdExample,
	GroupInfoExample,
	GroupInviteUrlExample,
	GroupListExample,
	MyGroupListExample,
} from './group.example';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { RespondApplicationDto } from './dto/patch-respond-application.dto';
import { GroupQueryDto } from './dto/group-query.dto';
import { Public } from '../auth/decorator/public.decorator';

@Controller({ path: 'group', version: '1' })
@ApiTags('Group')
export class GroupController {
	constructor(private readonly groupService: GroupService) {}

	@Public()
	@Get()
	@ApiOperation({
		summary: '모든 Group 목록 조회',
		description: '모든 Group 목록을 조회합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '조회 성공', GroupListExample)
	getGroupList(@Query() query: GroupQueryDto) {
		return this.groupService.getGroupList(query);
	}

	@Get('my')
	@ApiOperation({
		summary: '나의 Group 목록 조회',
		description: '나의 Group 목록을 조회합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '조회 성공', MyGroupListExample)
	getMyGroupList(@UserId() userId: string, @Query() query: GroupQueryDto) {
		return this.groupService.getMyGroupList(userId, query);
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

	@Patch(':groupId/application')
	@ApiOperation({
		summary: 'Group 가입 요청',
		description: 'Group 가입을 요청합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '요청 성공')
	async patchGroupApplying(
		@UserId() userId: string,
		@Param('groupId') groupId: string,
	) {
		await this.groupService.patchGroupApplying(userId, groupId);
	}

	@Patch(':groupId/application-response')
	@ApiOperation({
		summary: 'Group 가입 요청 처리(수락 또는 거절)',
		description: 'Group 가입 요청을 수락 또는 거절 처리합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '처리 성공')
	async patchRespondToApplication(
		@UserId() userId: string,
		@Param('groupId') groupId: string,
		@Body() request: RespondApplicationDto,
	) {
		await this.groupService.patchRespondToApplication(
			userId,
			groupId,
			request.accepted,
		);
	}

	@Get(':groupId/invitation')
	@ApiOperation({
		summary: 'Group 초대 링크 조회',
		description: 'Group 초대 링크를 조회합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '조회 성공', GroupInviteUrlExample)
	getInviteUrl(@UserId() userId: string, @Param('groupId') groupId: string) {
		return this.groupService.getInviteUrl(userId, groupId);
	}

	@Post('invitation')
	@ApiOperation({
		summary: '초대 링크를 통한 Group 가입',
		description: '초대 링크를 통한 Group 가입을 합니다.',
	})
	@ApiBaseResponse(201, '가입 성공')
	async postCreateGroupMember(
		@UserId() userId: string,
		@Body() request: CreateGroupMemberDto,
	) {
		await this.groupService.postCreateGroupMember(
			userId,
			request.inviteCode,
		);
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
		@Body() request: UpdateOwnerDto,
	) {
		await this.groupService.patchGroupOwner(
			userId,
			groupId,
			request.memberId,
		);
	}

	@Delete(':groupId/member')
	@ApiOperation({
		summary: '그룹 탈퇴',
		description: '그룹을 탈퇴합니다.',
	})
	@ApiBaseResponse(HttpStatus.OK, '탈퇴 성공')
	async deleteGroupWithdraw(
		@UserId() userId: string,
		@Param('groupId') groupId: string,
	) {
		await this.groupService.deleteGroupWithdraw(userId, groupId);
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
