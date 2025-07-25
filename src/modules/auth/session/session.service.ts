import { verify } from 'argon2';
import type { Request as ExpressRequest } from 'express';

import { PrismaService } from '@/src/core/prisma/prisma.service';

import { LoginInput } from './inputs/login.input';
import {
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
	) {}
	public async login(request: ExpressRequest, input: LoginInput) {
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

		return new Promise((resolve, reject) => {
			request.session.createdAt = new Date();
			request.session.userId = user.id;

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
}
