import { VerificationModule } from '../verification/verification.module';

import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';
import { Module } from '@nestjs/common';

@Module({
	imports: [VerificationModule],
	providers: [AccountResolver, AccountService],
})
export class AccountModule {}
