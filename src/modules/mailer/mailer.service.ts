import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { Options, SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { MAILER_TRANSPORT } from './mailer.providers';

@Injectable()
export class MailerService {
	private transporter: Transporter;
	private readonly senderAddress: string;

	constructor(@Inject(MAILER_TRANSPORT) private readonly transport: Options) {
		this.senderAddress = this.transport.auth!.user!;
		this.transporter = createTransport(this.transport);
	}

	async sendMail(to: string, subject: string, content: string) {
		const options = {
			from: {
				name: 'Quizbank',
				address: this.senderAddress,
			},
			to,
			subject,
			html: content,
		};

		return await new Promise<SentMessageInfo['response']>(
			(resolve, reject) =>
				this.transporter.sendMail(
					options,
					(error, info: SentMessageInfo) => {
						if (error) {
							// TODO 오류 종류 별 Exception 처리 필요!!
							reject(new BadRequestException('메일 전송 실패!'));
						} else {
							resolve(info.response);
						}
					},
				),
		);
	}
}
