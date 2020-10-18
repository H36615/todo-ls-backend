/* eslint-disable @typescript-eslint/no-explicit-any */

/** return mock represeting express's Response type */
export const createResMock = (): any => ({
	send: jest.fn(),
});

/**
 * Mock selected express imports.
 * 
 * NOTE: One might want to use this mocker before importing the testable entity,
 * in which case the testable entity can be imported after this mocker use,
 * using e.g. 'require("...")'.
 */
export const mockExpress = (getSpy: jest.Mock | undefined): void => {
	jest.doMock(
		"express",
		() => {
			if (getSpy == undefined) throw new Error("get spy missing");

			return {
				Router: () => ({
					get: getSpy,
				})
			};
		}
	);
};