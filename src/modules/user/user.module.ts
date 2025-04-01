import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_TYPE } from '../../database/database.const';
import { User, UserSchema } from './schema/user.schema';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: User.name, schema: UserSchema }],
			DB_TYPE.DEFAULT,
		),
	],
	providers: [UserService, UserRepository],
	exports: [UserService, UserRepository],
	controllers: [UserController],
})
export class UserModule {}
