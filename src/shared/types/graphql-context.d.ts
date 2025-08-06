import type { ExpressRequest, ExpressResponse } from '.';

export interface GraphqlContext {
	req: ExpressRequest;
	res: ExpressResponse;
}
