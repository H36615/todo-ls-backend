/* eslint-disable @typescript-eslint/no-explicit-any */

/** return mock represeting express's Response type */
export const createResMock = (): any => ({
	send: jest.fn(),
});