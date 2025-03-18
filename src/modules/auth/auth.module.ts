import { Module } from '@nestjs/common';
import { EmailCodeModule } from './email-code/email-code.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
	imports: [UserModule, EmailCodeModule],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
