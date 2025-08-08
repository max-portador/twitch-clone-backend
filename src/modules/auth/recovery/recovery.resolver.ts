import { UserAgent } from '@/src/shared/decorators/user-agent.decorator';
import { GraphqlContext } from '@/src/shared/types/graphql-context';

import { ResetPasswordInput } from './inputs/reset-password.input';
import { RecoveryService } from './recovery.service';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

@Resolver('Recovery')
export class RecoveryResolver {
	constructor(private readonly recoveryService: RecoveryService) {}

	@Mutation(() => Boolean, { name: 'resetPassword' })
	public async resetPassword(
		@Context() ctx: GraphqlContext,
		@Args('data') input: ResetPasswordInput,
		@UserAgent() userAgent: string,
	) {
		return this.recoveryService.resetPassword(ctx.req, input, userAgent);
	}
}
