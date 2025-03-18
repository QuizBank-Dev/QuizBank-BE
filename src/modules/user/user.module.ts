import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_TYPE } from '../../database/database.const';
import { User, UserSchema } from './schema/user.schema';
import { UserService } from './user.service';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: User.name, schema: UserSchema }],
			DB_TYPE.DEFAULT,
		),
	],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
