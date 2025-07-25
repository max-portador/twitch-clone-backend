import * as session from 'express-session';

import { PrismaService } from '@/src/core/prisma/prisma.service';

import {
	CanActivate,
	type ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GraphqlAuthGuard implements CanActivate {
	public constructor(private readonly prismaService: PrismaService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context);

		const request = ctx.getContext().req;

		const userId = request.session.userId;

		if (typeof userId === 'undefined') {
			throw new UnauthorizedException('Пользователь не авторизован');
		}

		const user = await this.prismaService.user.findUnique({
			where: {
				id: userId,
			},
		});

		request.user = user;

		return true;
	}
}
