/* eslint-disable @typescript-eslint/no-explicit-any */

/** return mock represeting express's Response type */
export const createResMock = (): any => ({
	send: jest.fn(),
});

/**
 * Mock selected express imports.
 * 
 * NOTE: One might want to use this mocker before importing the testable entity,
 * in which case the testable entity should be imported after the use of this mocker,
 * using e.g. 'require("...")'.
 */
export const mockExpress = (getSpy?: jest.Mock, postSpy?: jest.Mock): void => {
	jest.doMock(
		"express",
		() => ({
			Router: () => ({
				get: getSpy || empty,
				post: postSpy || empty,
			})
		})
	);
};

const empty = () => {
	// Uncomment for debugging.
	// console.log("missing router property");
};