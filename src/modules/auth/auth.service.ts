import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService) {}

	/**
	 * 회원가입
	 * @param createUserDto 이메일, 비밀번호, 닉네임
	 */
	async register(createUserDto: CreateUserDto) {
		try {
			return await this.userService.create(createUserDto);
		} catch (error) {
			throw new BadRequestException('회원가입을 실패했습니다.');
		}
	}
}
