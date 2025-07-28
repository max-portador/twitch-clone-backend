import type { Request as ExpressRequest } from 'express';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const UserAgent = createParamDecorator((_, ctx: ExecutionContext) => {
	const request =
		ctx.getType() === 'http'
			? ctx.switchToHttp().getRequest<ExpressRequest>()
			: getGraphqlRequest(ctx);

	return 'headers' in request ? request.headers['user-agent'] : '';
});

function getGraphqlRequest(ctx: ExecutionContext): ExpressRequest {
	const context = GqlExecutionContext.create(ctx).getContext<{
		req: ExpressRequest;
	}>();

	return context.req;
}
