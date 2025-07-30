import { ConfigModule, ConfigService } from '@nestjs/config';

import { AccountModule } from 'src/modules/auth/account/account.module';
import { ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { IS_DEV_ENV } from 'src/shared/utils/isDev.util';
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { SessionModule } from 'src/modules/auth/session/session.module';
import { VerificationModule } from '../modules/auth/verification/verification.module';
import { getGraphQLConfig } from './config/graphql.config';

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true,
		}),
		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			imports: [ConfigModule],
			useFactory: getGraphQLConfig,
			inject: [ConfigService],
		}),
		PrismaModule,
		RedisModule,
		AccountModule,
		SessionModule,
		VerificationModule,
	],
	controllers: [],
	providers: [],
})
export class CoreModule {}
