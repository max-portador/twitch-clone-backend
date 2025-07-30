import { VerificationService } from './verification.service';
import { Resolver } from '@nestjs/graphql';

@Resolver('Verification')
export class VerificationResolver {
	constructor(private readonly verificationService: VerificationService) {}
}
