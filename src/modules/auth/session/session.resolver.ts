import type { GraphqlContext } from '@/src/shared/types/graphql-context';

import { UserModel } from '../account/models/user.model';

import { LoginInput } from './inputs/login.input';
import { SessionService } from './session.service';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

@Resolver('Session')
export class SessionResolver {
	public constructor(private readonly sessionService: SessionService) {}

	@Mutation(() => UserModel, { name: 'loginUser' })
	public async login(
		@Context() { req }: GraphqlContext,
		@Args('data') input: LoginInput,
	) {
		return this.sessionService.login(req, input);
	}

	@Mutation(() => Boolean, { name: 'logoutUser' })
	public async logout(@Context() { req }: GraphqlContext) {
		return this.sessionService.logout(req);
	}
}
