import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthTokenService } from './auth-token.service';
import { AuthTokenProviders } from './auth-token.providers';

@Global()
@Module({
	imports: [JwtModule],
	providers: [AuthTokenService, ...AuthTokenProviders],
	exports: [AuthTokenService],
})
export class AuthTokenModule {}
