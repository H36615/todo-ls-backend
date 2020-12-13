/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IReqMock {
	body: any,
	// ...
}

export class ExpressTestHelpers {

	/** return mock represeting express's Response type */
	public static createResMock(): any {
		return {
			send: jest.fn(),
			json: jest.fn(),
			status: jest.fn(),
		};
	}

	/**
	 * Mock selected express imports.
	 * 
	 * NOTE: One might want to use this mocker before importing the testable entity,
	 * in which case the testable entity should be imported after the use of this mocker,
	 * using e.g. 'require("...")'.
	 */
	public static mockExpress(getSpy?: jest.Mock, postSpy?: jest.Mock): void {
		jest.doMock(
			"express",
			() => ({
				Router: () => ({
					get: getSpy || this.empty,
					post: postSpy || this.empty,
				})
			})
		);
	}

	private static empty = () => {
		// Uncomment for debugging.
		// console.log("missing router propertyyy");
	};
}