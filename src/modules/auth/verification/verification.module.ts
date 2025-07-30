import { MailModule } from '@/src/libs/mail/mail.module';
import { Module } from '@nestjs/common';
import { VerificationResolver } from './verification.resolver';
import { VerificationService } from './verification.service';

@Module({
	imports: [MailModule],
	providers: [VerificationResolver, VerificationService],
})
export class VerificationModule {}
