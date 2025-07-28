import { verify } from 'argon2';
import type { Request as ExpressRequest } from 'express';
import { SessionData } from 'express-session';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { RedisService } from '@/src/core/redis/redis.service';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.utils';

import { LoginInput } from './inputs/login.input';
import { SessionModel } from './models/session.model';
import { sortByCreatedAt } from './utils/sort.utils';
import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly redisService: RedisService,
	) {}

	public async findByUser(req: ExpressRequest) {
		const userId = req.session.userId;

		if (!userId) {
			throw new NotFoundException('Пользователь не найден');
		}

		const keys = await this.redisService.keys('*');

		const userSessions: SessionModel[] = [];

		for (const key of keys) {
			const sessionData = await this.redisService.get(key);

			if (sessionData) {
				const session = JSON.parse(sessionData) as SessionModel;

				if (session && session.userId && session.userId === userId) {
					const id = key.split(':')[1];
					if (req.session.id === id) {
						session.id = id;
						userSessions.push(session);
					}
				}
			}
		}

		return userSessions.sort(sortByCreatedAt);
	}

	private getSessionKey(sessionId: string) {
		return `${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`;
	}

	private async getSessionByReq<T extends SessionData = SessionData>(
		req: ExpressRequest,
	) {
		const sessionId = req.session.id;
		const key = this.getSessionKey(sessionId);

		const sessionData = await this.redisService.get(key);

		if (!sessionData) {
			throw new NotFoundException('Сессия не найдена');
		}

		return JSON.parse(sessionData) as T;
	}

	public async findCurrent(req: ExpressRequest) {
		const sessionId = req.session.id;
		const session = await this.getSessionByReq(req);

		return { ...session, id: sessionId };
	}

	public async login(
		request: ExpressRequest,
		input: LoginInput,
		userAgent: string,
	) {
		const { login, password } = input;

		const user = await this.prismaService.user.findFirst({
			where: {
				OR: [
					{
						username: { equals: login },
					},
					{
						email: { equals: login },
					},
				],
			},
		});

		if (!user) {
			throw new NotFoundException('Пользователь не найден');
		}

		const isValidPassword = await verify(user.password, password);

		if (!isValidPassword) {
			throw new UnauthorizedException('Неверный пароль');
		}

		const metadata = getSessionMetadata(request, userAgent);

		return new Promise((resolve, reject) => {
			request.session.createdAt = new Date();
			request.session.userId = user.id;
			request.session.metadata = metadata;

			request.session.save(err => {
				if (err) {
					reject(
						new InternalServerErrorException(
							'Не удалось сохранить сессию',
						),
					);
				}

				resolve(user);
			});
		});
	}
	public async logout(request: ExpressRequest) {
		return new Promise((resolve, reject) => {
			request.session.destroy(err => {
				if (err) {
					reject(
						new InternalServerErrorException(
							'Не удалось завершить сессию',
						),
					);
				}

				if (!request.res?.clearCookie) {
					console.debug('No clear method');
				}
				request.res?.clearCookie(
					this.configService.getOrThrow<string>('SESSION_NAME'),
				);

				resolve(true);
			});
		});
	}

	public clearSession(req: ExpressRequest) {
		req.res?.clearCookie(
			this.configService.getOrThrow<string>('SESSION_NAME'),
		);

		return true;
	}

	public async remove(req: ExpressRequest, id: string) {
		if (req.session.id === id) {
			throw new ConflictException('Текущую сессию удалить нельзя');
		}

		const sessionKey = this.getSessionKey(id);

		await this.redisService.del(sessionKey);

		return true;
	}
}
