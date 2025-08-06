import { VerificationTemplate } from './templates/verification.template';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';

@Injectable()
export class MailService {
	public constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService,
	) {}

	public async sendVerificationToken(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOW_ORIGIN');
		const supportEmail =
			this.configService.getOrThrow<string>('SUPPORT_EMAIL');

		const html = await render(
			VerificationTemplate({ domain, token, supportEmail }),
		);

		this.sendMail(email, 'Account verification', html);
	}

	private sendMail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: email,
			subject,
			html,
		});
	}
}
