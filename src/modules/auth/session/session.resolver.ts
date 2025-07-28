import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator';
import type { GraphqlContext } from '@/src/shared/types/graphql-context';

import { UserModel } from '../account/models/user.model';

import { LoginInput } from './inputs/login.input';
import { SessionModel } from './models/session.model';
import { SessionService } from './session.service';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver('Session')
export class SessionResolver {
	public constructor(private readonly sessionService: SessionService) {}

	@Mutation(() => UserModel, { name: 'loginUser' })
	public async login(
		@Context() { req }: GraphqlContext,
		@Args('data') input: LoginInput,
		@UserAgent() userAgent: string,
	) {
		return this.sessionService.login(req, input, userAgent);
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'logoutUser' })
	public async logout(@Context() { req }: GraphqlContext) {
		return this.sessionService.logout(req);
	}

	@Authorization()
	@Query(() => [SessionModel], { name: 'findSessionsByUser' })
	public async findByUser(@Context() { req }: GraphqlContext) {
		return await this.sessionService.findByUser(req);
	}

	@Authorization()
	@Query(() => SessionModel, { name: 'findCurrentSessions' })
	public async findCurrent(@Context() { req }: GraphqlContext) {
		return await this.sessionService.findCurrent(req);
	}

	@Mutation(() => Boolean, { name: 'clearSessionCookie' })
	public clearSession(@Context() { req }: GraphqlContext) {
		return this.sessionService.clearSession(req);
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeSession' })
	public remove(@Context() { req }: GraphqlContext, @Args('id') id: string) {
		return this.sessionService.remove(req, id);
	}
}
