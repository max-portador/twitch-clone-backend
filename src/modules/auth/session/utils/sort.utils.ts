import { SessionModel } from '../models/session.model';

export function sortByCreatedAt(a: SessionModel, b: SessionModel) {
	const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
	const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

	return dateB - dateA;
}
