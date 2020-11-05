/* eslint-disable @typescript-eslint/no-explicit-any */

import knex from "knex";

/**
 * Mock db config's selected functions to respond w/ mock promise response.
 * If Error is passed to 'response', a rejecting promise w/ the error
 * will be responded.
 */
function mockDBConfig(dBConfig: knex, response: Record<string, any> | Error): void {
	(dBConfig as any).mockImplementation(() => ({
		select: () =>
			(response instanceof Error)
				? Promise.reject(response)
				: Promise.resolve(response),
		insert: () =>
			(response instanceof Error)
				? Promise.reject(response)
				: Promise.resolve(response),
		where: () =>
			(response instanceof Error)
				? Promise.reject(response)
				: Promise.resolve(response),
	}));
}

export { mockDBConfig };