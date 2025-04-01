import {
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
import { UserId } from '../../common/decorators/user-id.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('me')
	async me(@UserId() userId: string) {
		return await this.userService.getMyInformation(userId);
	}

	@Get(':id')
	async other(@Param('id') id: string) {
		return await this.userService.getUserInformation(id);
	}

	@Patch('me')
	@UseInterceptors(FileInterceptor('profileImg'))
	editMe(
		@UserId() userId: string,
		@Body() updateUserDto: UpdateProfileDto,
		@UploadedFile() file: Express.Multer.File,
	) {
		return this.userService.updateProfile(userId, updateUserDto, file);
	}

	@Delete('me/profile-image')
	deleteProfileImg(@UserId() userId: string) {
		return this.userService.deleteProfileImg(userId);
	}
}
