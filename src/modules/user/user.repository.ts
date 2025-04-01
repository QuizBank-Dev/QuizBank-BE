import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType, RootFilterQuery } from 'mongoose';
import { User } from './schema/user.schema';
import { DB_TYPE } from '../../database/database.const';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
	constructor(
		@InjectModel(User.name, DB_TYPE.DEFAULT)
		private readonly userModel: Model<User>,
	) {}

	/**
	 * 유저 생성
	 */
	async create({ email, password, nickname }: CreateUserDto) {
		return await this.userModel.create({
			email,
			password,
			nickname,
		});
	}

	/**
	 * 유저 조회 (id)
	 */
	async findById(id: string) {
		return this.userModel.findById(id);
	}

	/**
	 * 유저 조회 (id 이외)
	 */
	async findOne(
		filters: RootFilterQuery<User>,
		projections?: ProjectionType<User>,
	) {
		return this.userModel.findOne(filters, projections);
	}

	/**
	 * 특정 유저 수정
	 */
	async update(id: string, updateUserDto: UpdateUserDto) {
		return this.userModel.findByIdAndUpdate(id, updateUserDto);
	}

	/**
	 * 유저 삭제
	 * @param id
	 */
	async delete(id: string) {
		// TODO 삭제로직 수정
		return this.userModel.findByIdAndUpdate(id, { deletedAt: new Date() });
	}
}
