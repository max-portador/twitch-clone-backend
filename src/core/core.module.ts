import { ConfigModule, ConfigService } from '@nestjs/config'

import { ApolloDriver } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { IS_DEV_ENV } from 'src/shared/utils/isDev.util'
import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { getGraphQLConfig } from './config/graphql.config'
import { RedisModule } from './redis/redis.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true
		}),
		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			imports: [ConfigModule],
			useFactory: getGraphQLConfig,
			inject: [ConfigService]
		}),
		PrismaModule,
		RedisModule
	],
	controllers: [],
	providers: []
})
export class CoreModule {}
