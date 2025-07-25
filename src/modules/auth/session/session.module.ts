import { SessionResolver } from './session.resolver';
import { SessionService } from './session.service';
import { Module } from '@nestjs/common';

@Module({
	providers: [SessionResolver, SessionService],
})
export class SessionModule {}
