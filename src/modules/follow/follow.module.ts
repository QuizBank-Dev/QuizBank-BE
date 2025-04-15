import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { UserModule } from '../user/user.module';

@Module({
	imports: [UserModule],
	controllers: [FollowController],
	providers: [FollowService],
})
export class FollowModule {}
