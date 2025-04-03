import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class UserService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly imageUploadService: UploadService,
	) {}

	/**
	 * 유저 정보 조회
	 * @param userId
	 */
	async getUser(userId: string) {
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
		}

		return {
			_id: user._id,
			nickname: user.nickname,
			profileImg: user.profileImg,
			introduce: user.introduce,
			category: user.category,
			experience: user.experience,
			isOAuthAccount: !!user.oAuth,
		};
	}

	/**
	 * 유저의 정보, 학습 현황, 해당 유저가 만든 문제집 목록 조회
	 * @param userId
	 */
	async getUserAndStudy(userId: string) {
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
		}

		// TODO userId로 해당 유저의 quizbook, record 가져오는 서비스
		const [quizbook, record] = await Promise.all([
			new Promise<string[]>((resolve) => resolve([])),
			new Promise<string[]>((resolve) => resolve([])),
		]);

		return {
			_id: user._id,
			nickname: user.nickname,
			profileImg: user.profileImg,
			introduce: user.introduce,
			experience: user.experience,
			follower: user.follower,
			quizbook,
			record,
		};
	}

	/**
	 * 유저 닉네임, 소개, 프로필이미지 변경
	 * @param userId
	 * @param nickname
	 * @param introduce
	 * @param file
	 */
	async updateProfile(
		userId: string,
		{ nickname, introduce }: UpdateProfileDto,
		file?: Express.Multer.File,
	) {
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
		}

		const updateData = { nickname, introduce };

		// profileImg는 파일이 있는 경우에만 처리
		if (file) {
			const savedImage = await this.imageUploadService.upload(file);

			if (user.profileImg) {
				// 이미 프로필사진이 존재하는 경우 해당 이미지 삭제
				await this.imageUploadService.delete(user.profileImg);
			}

			updateData['profileImg'] = savedImage;
		}

		return this.userRepository.update(userId, updateData);
	}

	/**
	 * 유저 프로필 이미지 제거
	 * @param userId
	 */
	async deleteProfileImg(userId: string) {
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
		}

		await this.imageUploadService.delete(user.profileImg);

		return this.userRepository.update(userId, { profileImg: '' });
	}
}
