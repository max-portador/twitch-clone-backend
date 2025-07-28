import 'express-session';

import type { SessionMetaData } from './session-metadata';

declare module 'express-session' {
	interface SessionData {
		userId?: string;
		createdAt?: Date | string;
		metadata: SessionMetaData;
	}
}
