import { Controller, Get, Param } from '@nestjs/common';
import { UserId } from '../../common/decorators/user-id.decorator';
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
}
