import { Module } from '@nestjs/common';
import { EmailCodeModule } from './email-code/email-code.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthTokenModule } from './auth-token/auth-token.module';
import { LocalStrategy } from './strategy/local.strategy';
import { GitHubStrategy } from './strategy/github.strategy';
import { FollowModule } from '../follow/follow.module';
import { GroupModule } from '../group/group.module';
import { StudyLogModule } from '../study-log/study-log.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { AuthProviders } from './auth.providers';

@Module({
	imports: [
		UserModule,
		EmailCodeModule,
		AuthTokenModule,
		FollowModule,
		GroupModule,
		StudyLogModule,
		ResetPasswordModule,
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, GitHubStrategy, ...AuthProviders],
	exports: [...AuthProviders],
})
export class AuthModule {}
