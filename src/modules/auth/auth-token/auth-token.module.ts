import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthTokenService } from './auth-token.service';
import { AuthTokenProviders } from './auth-token.providers';

@Global()
@Module({
	imports: [CacheModule.register(), JwtModule],
	providers: [AuthTokenService, ...AuthTokenProviders],
	exports: [AuthTokenService],
})
export class AuthTokenModule {}
