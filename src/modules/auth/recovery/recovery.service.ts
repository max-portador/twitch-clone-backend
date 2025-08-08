import { Injectable, NotFoundException } from '@nestjs/common';

import { ExpressRequest } from '@/src/shared/types';
import { MailService } from '../../../libs/mail/mail.service';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { TokenType } from '@prisma/generated';
import { generateToken } from '@/src/shared/utils/generate-token.utils';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.utils';

@Injectable()
export class RecoveryService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
	) {}

	public async resetPassword(
		req: ExpressRequest,
		input: ResetPasswordInput,
		userAgent: string,
	) {
		const email = input.email;

		const user = await this.prismaService.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			throw new NotFoundException('Пользователь не найден');
		}

		const resetToken = await generateToken(
			this.prismaService,
			user,
			TokenType.PASSWORD_RESET,
		);

		const metadata = getSessionMetadata(req, userAgent);

		await this.mailService.sendPasswordResetToken(
			email,
			resetToken.token,
			metadata,
		);

		return true;
	}
}
