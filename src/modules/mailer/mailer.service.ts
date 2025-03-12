import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { createTransport, Transporter } from 'nodemailer';
import { Options, SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { MAILER_TRANSPORT } from './mailer.providers';

@Injectable()
export class MailerService {
	private readonly transporter: Transporter;
	private readonly senderAddress: string;

	constructor(
		@Inject(MAILER_TRANSPORT) private readonly transport: Options,
		@Inject('winston') private readonly logger: Logger,
	) {
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
							this.logger.error(error.stack || error.message, {
								context: 'Mailer',
							});
							reject(new BadRequestException('메일 전송 실패!'));
						} else {
							this.logger.info(info.response, {
								context: 'Mailer',
							});
							resolve(info.response);
						}
					},
				),
		);
	}
}
