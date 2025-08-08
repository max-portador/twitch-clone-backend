import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PasswordRecoveryTemplate } from './templates/recovery.template';
import { SessionMetaData } from '@/src/shared/types/session-metadata';
import { VerificationTemplate } from './templates/verification.template';
import { getSessionMetadata } from '../../shared/utils/session-metadata.utils';
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

	public async sendPasswordResetToken(
		email: string,
		token: string,
		metadata: SessionMetaData,
	) {
		const domain = this.configService.getOrThrow<string>('ALLOW_ORIGIN');
		const supportEmail =
			this.configService.getOrThrow<string>('SUPPORT_EMAIL');

		const html = await render(
			PasswordRecoveryTemplate({ domain, token, metadata, supportEmail }),
		);

		this.sendMail(email, 'Password reset', html);
	}

	private sendMail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: email,
			subject,
			html,
		});
	}
}
