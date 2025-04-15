import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserId } from '../../common/decorators/user-id.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserService } from './user.service';
import { ApiBaseResponse } from '../../common/decorators/base-response.decorator';
import { meExample, otherExample } from './user.example';

@Controller({ path: 'user', version: '1' })
@ApiTags('User')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('me')
	@ApiOperation({
		summary: '내 정보',
		description: '현재 로그인한 사용자의 정보를 가져옵니다.',
	})
	@ApiBaseResponse(200, '조회 성공', meExample)
	async me(@UserId() userId: string) {
		return await this.userService.getUser(userId);
	}

	@Get(':id')
	@ApiOperation({
		summary: '다른 사용자 정보',
		description:
			'다른 사용자의 정보, 학습현황, 문제집리스트(일부)를 가져옵니다.',
	})
	@ApiBaseResponse(200, '조회 성공', otherExample)
	async other(@Param('id') id: string) {
		return await this.userService.getUserAndStudy(id);
	}

	@Patch('me')
	@UseInterceptors(FileInterceptor('profileImg'))
	@ApiOperation({
		summary: '사용자 정보 수정',
		description:
			'현재 로그인한 사용자의 닉네임, 소개, 프로필사진을 변경합니다.',
	})
	@ApiBaseResponse(200, '변경 성공')
	@ApiConsumes('multipart/form-data')
	editMe(
		@UserId() userId: string,
		@Body() updateUserDto: UpdateProfileDto,
		@UploadedFile() file: Express.Multer.File,
	) {
		if (file && !file.mimetype.startsWith('image/')) {
			throw new BadRequestException(
				'이미지 파일만 업로드할 수 있습니다.',
			);
		}

		return this.userService.updateProfile(userId, updateUserDto, file);
	}

	@Delete('me/profile-image')
	@ApiOperation({
		summary: '프로필사진 제거',
		description: '현재 적용되어있는 프로필사진을 제거합니다.',
	})
	@ApiBaseResponse(200, '제거 성공')
	deleteProfileImg(@UserId() userId: string) {
		return this.userService.deleteProfileImg(userId);
	}
}
