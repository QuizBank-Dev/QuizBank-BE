import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { envKeys } from '../../config/env.const';
import { DB_TYPE } from '../../database/database.const';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
	constructor(
		private readonly configService: ConfigService,
		@InjectModel(User.name, DB_TYPE.DEFAULT)
		private readonly userModel: Model<User>,
	) {}

	async create({ email, password, nickname }: CreateUserDto) {
		const hashedPassword: string = await bcrypt.hash(
			password,
			this.configService.get<number>(envKeys.SECURITY.HASH_ROUNDS)!,
		);

		return await this.userModel.create({
			email,
			password: hashedPassword,
			nickname,
		});
	}
}
