import { v4 } from 'uuid';

import { PrismaService } from '@/src/core/prisma/prisma.service';

import { TokenType, User } from '@prisma/generated';

const MAX = 1_000_000;
const DELTA = 10_000;
const MIN = MAX - DELTA;

const TTL = 5 * 60 * 1_000; // 5 min

export async function generateToken(
	prismaService: PrismaService,
	user: User,
	type: TokenType,
	isUUID: boolean = false,
) {
	let token: string;

	if (isUUID) {
		token = v4();
	} else {
		token = Math.floor(Math.random() * MIN + DELTA).toString();
	}
	const expiresIn = new Date(new Date().getTime() + TTL);

	const existingToken = await prismaService.token.findFirst({
		where: {
			type,
			user: {
				id: user.id,
			},
		},
	});

	if (existingToken) {
		await prismaService.token.delete({ where: { id: existingToken.id } });
	}

	const newToken = await prismaService.token.create({
		data: {
			token,
			expiresIn,
			type,
			user: {
				connect: {
					id: user.id,
				},
			},
		},
		include: { user: true },
	});

	return newToken;
}
