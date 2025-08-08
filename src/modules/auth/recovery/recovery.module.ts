import { MailModule } from '@/src/libs/mail/mail.module';
import { Module } from '@nestjs/common';
import { RecoveryResolver } from './recovery.resolver';
import { RecoveryService } from './recovery.service';

@Module({
	imports: [MailModule],
	providers: [RecoveryResolver, RecoveryService],
})
export class RecoveryModule {}
