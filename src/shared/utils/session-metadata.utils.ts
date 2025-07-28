import type { Request as ExpressRequest } from 'express';
import { lookup } from 'geoip-lite';
import * as countries from 'i18n-iso-countries';

import type { SessionMetaData } from '../types/session-metadata';

import { IS_DEV_ENV } from './isDev.util';

// eslint-disable-next-line @typescript-eslint/no-require-imports
import DeviceDetector = require('device-detector-js');

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-require-imports
countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

export function getSessionMetadata(
	req: ExpressRequest,
	userAgent: string,
): SessionMetaData {
	const ip = getIp(req);

	const location = lookup(ip);
	const device = new DeviceDetector().parse(userAgent);
	return {
		location: {
			country: getCountry(location?.country),
			city: location?.city || 'unknown',
			latitude: location?.ll[0] || 0,
			longitude: location?.ll[1] || 0,
		},
		device: {
			browser: device.client?.name || 'unknown',
			os: device.os?.name || 'unknown',
			type: device.device?.type || 'unknown',
		},
		ip,
	};
}

function getIp(req: ExpressRequest): string {
	if (IS_DEV_ENV) {
		return '173.166.164.121';
	}

	const header = req.headers['cf-connecting-ip'];

	if (header) {
		return Array.isArray(header) ? header[0] : header;
	}

	const forwardedHeader = req.headers['x-forwarded-for'];

	if (typeof forwardedHeader === 'string') {
		return forwardedHeader.split(',')[0];
	}

	return String(req.ip);
}

function getCountry(country: string | undefined) {
	if (country) {
		const name = countries.getName(country, 'en');

		if (name) {
			return name;
		}

		return country;
	}

	return 'unknown';
}
