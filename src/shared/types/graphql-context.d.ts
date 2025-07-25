import type {
	Request as ExpressRequest,
	Response as ExpressResponse,
} from 'express';

export interface GraphqlContext {
	req: ExpressRequest;
	res: ExpressResponse;
}
