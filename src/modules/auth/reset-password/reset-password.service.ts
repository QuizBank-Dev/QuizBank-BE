import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { envKeys } from '../../../config/env.const';
import { DB_TYPE } from '../../../database/database.const';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { UserRepository } from '../../user/user.repository';
import { MailerService } from '../../mailer/mailer.service';
import { AuthTokenService } from '../auth-token/auth-token.service';
import { TokenType } from '../auth-token/auth-token.types';
import { ResetPassword } from './schema/reset-password.schema';
import { MAIL_CONTENT, MAIL_TITLE } from './reset-password.const';

@Injectable()
export class ResetPasswordService {
	private readonly clientUrl: string;

	constructor(
		private readonly configService: ConfigService,
		private readonly userRepository: UserRepository,
		private readonly mailerService: MailerService,
		private readonly authTokenService: AuthTokenService,
		@InjectModel(ResetPassword.name, DB_TYPE.DEFAULT)
		private readonly resetPasswordModel: Model<ResetPassword>,
	) {
		const isDev = this.configService.get<string>(envKeys.ENV) === 'dev';
		this.clientUrl = this.configService.get<string>(
			isDev ? envKeys.CLIENT.LOCAL : envKeys.CLIENT.PROD,
		)!;
	}

	/**
	 * 비밀번호 초기화 링크 메일 전송
	 * @param email 전송 대상 이메일
	 */
	async request({ email }: RequestResetPasswordDto) {
		const user = await this.userRepository.findOne({ email });

		// 해당하는 유저가 존재하는 경우에만 처리
		if (user) {
			const token = this.authTokenService.generateToken(
				TokenType.RESET_PASSWORD,
				{ email },
			);

			// 비밀번호 초기화
			await this.resetPasswordModel.findOneAndUpdate(
				{ email, userId: user._id },
				{
					userId: user._id,
					email,
					token,
					// 1시간 뒤에 만료
					expiredAt: moment().add(1, 'hour').toDate(),
				},
				// 없으면 생성 / 존재하면 덮어씌우기
				{ upsert: true },
			);

			await this.mailerService.sendMail(
				email,
				MAIL_TITLE,
				MAIL_CONTENT(`${this.clientUrl}/reset-password?token=${token}`),
			);
		}

		return;
	}
}
