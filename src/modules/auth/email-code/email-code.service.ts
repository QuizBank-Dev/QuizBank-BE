import { Model } from 'mongoose';
import {
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GenerateEmailVerificationCodeDto } from './dto/generate-email-verification-code.dto';
import { EmailVerificationDto } from './dto/email-verification.dto';
import { EmailCode } from './schema/email-code.schema';
import { MailerService } from '../../mailer/mailer.service';
import { DB_TYPE } from '../../../database/database.const';
import { MAIL_CONTENT, MAIL_TITLE } from './email-code.const';

@Injectable()
export class EmailCodeService {
	constructor(
		private readonly mailerService: MailerService,
		@InjectModel(EmailCode.name, DB_TYPE.DEFAULT)
		private readonly emailCodeModel: Model<EmailCode>,
	) {}

	/**
	 * 인증코드를 사용해 이메일 인증
	 * @param email 사용자가 입력한 이메일 주소
	 * @param code 이메일로 전송된 코드
	 */
	async verification({ email, code }: EmailVerificationDto) {
		const result = await this.emailCodeModel.findOne({
			email,
			code,
			expiredAt: { $gte: new Date() },
		});

		if (!result) {
			throw new UnauthorizedException('인증 코드가 유효하지 않습니다.');
		}

		// TODO 이미 가입된 이메일인지 확인
		const user = false; // await this.userModel.findOne({ email });

		if (user) {
			throw new ConflictException('이미 가입된 이메일입니다.');
		}
	}

	/**
	 * 인증코드 생성
	 * @param email 사용자가 입력한 이메일 주소
	 */
	async generateCode({ email }: GenerateEmailVerificationCodeDto) {
		const code = this.makeCode();

		await this.emailCodeModel.findOneAndUpdate(
			{ email },
			{ email, code, expiredAt: Date.now() + 300 * 1000 },
			{ upsert: true },
		);

		await this.mailerService.sendMail(
			email,
			MAIL_TITLE,
			MAIL_CONTENT(code),
		);
	}

	/**
	 * 랜덤한 코드 생성
	 * @param length 길이 (default: 6)
	 */
	private makeCode(length: number = 6): string {
		return Math.random()
			.toString(32)
			.substring(2, 2 + length)
			.toUpperCase();
	}
}
