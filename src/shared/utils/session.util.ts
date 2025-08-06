import { ExpressRequest } from '../types';
import { SessionMetaData } from '../types/session-metadata';

import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/generated';

export function saveSession(
	request: ExpressRequest,
	user: User,
	metadata: SessionMetaData,
) {
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

export function destroySession(
	request: ExpressRequest,
	configService: ConfigService,
) {
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
				configService.getOrThrow<string>('SESSION_NAME'),
			);

			resolve(true);
		});
	});
}
