import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';
import { Module } from '@nestjs/common';

@Module({
	providers: [AccountResolver, AccountService],
})
export class AccountModule {}
