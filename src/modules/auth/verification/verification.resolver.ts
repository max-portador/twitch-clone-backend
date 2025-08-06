import { UserAgent } from '@/src/shared/decorators/user-agent.decorator';
import { GraphqlContext } from '@/src/shared/types/graphql-context';

import { UserModel } from '../account/models/user.model';

import { VerificationInput } from './inputs/verification.input';
import { VerificationService } from './verification.service';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

@Resolver('Verification')
export class VerificationResolver {
	constructor(private readonly verificationService: VerificationService) {}

	@Mutation(() => UserModel, { name: 'verifyAccount' })
	public async verify(
		@Context() ctx: GraphqlContext,
		@Args('data') input: VerificationInput,
		@UserAgent() userAgent: string,
	) {
		return this.verificationService.verify(ctx.req, input, userAgent);
	}
}
