import { join } from 'path';

import { ApolloDriverConfig } from './../../../node_modules/@nestjs/apollo/dist/interfaces/apollo-driver-config.interface.d';
import { ConfigService } from '@nestjs/config';
import { isDev } from 'src/shared/utils/isDev.util';

export function getGraphQLConfig(
	configService: ConfigService,
): ApolloDriverConfig {
	return {
		playground: isDev(configService),
		path: configService.getOrThrow<string>('GRAPHQL_PREFIX'),
		autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
		sortSchema: true,
		context: ({ req, res }) => ({ req, res }),
	};
}
