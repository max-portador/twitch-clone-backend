import { MailModule } from '@/src/libs/mail/mail.module';

import { VerificationResolver } from './verification.resolver';
import { VerificationService } from './verification.service';
import { Module } from '@nestjs/common';

@Module({
	imports: [MailModule],
	providers: [VerificationResolver, VerificationService],
	exports: [VerificationService],
})
export class VerificationModule {}
