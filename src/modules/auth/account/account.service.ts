import { hash } from 'argon2';

import { CreateUserInput } from './inputs/create-user.input';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AccountService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findAll() {
		return this.prismaService.user.findMany();
	}

	public async create(input: CreateUserInput) {
		const { username, email, password } = input;

		const isUsernameExist = await this.prismaService.user.findUnique({
			where: {
				username,
			},
		});

		if (isUsernameExist) {
			throw new ConflictException('Это имя пользователя уже занято');
		}

		const isEmailExist = await this.prismaService.user.findUnique({
			where: {
				email,
			},
		});

		if (isEmailExist) {
			throw new ConflictException('Эта почта уже занята');
		}

		const user = await this.prismaService.user.create({
			data: {
				username,
				email,
				password: await hash(password),
				displayName: username,
			},
		});

		return user;
	}
}
