import { GraphqlAuthGuard } from '../guards/graphql-auth.guard';

import { applyDecorators, UseGuards } from '@nestjs/common';

export function Authorization() {
	return applyDecorators(UseGuards(GraphqlAuthGuard));
}
