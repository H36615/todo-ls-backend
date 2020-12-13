import { Environment, EnvironmentUtils } from "./environment";

describe("environment utils", () => {
	describe("getValidatedEnvironment", () => {
		beforeEach(() => {
			jest.resetModules();
		});

		[
			Environment.development,
			Environment.production,
		]
			.forEach(testableValue => {
				test(testableValue + " should be valid", () => {
					process.env.ENVIRONMENT = testableValue;

					require("./environment");

					expect(EnvironmentUtils.getValidatedEnvironment()).toEqual(testableValue);
				});
			});

		[
			undefined,
			"asbaasdfsfdsfd",
		]
			.forEach(testableValue => {
				test(testableValue + " should be invalid", () => {
					process.env.ENVIRONMENT = testableValue;

					require("./environment");

					expect(EnvironmentUtils.getValidatedEnvironment).toThrowError();
				});
			});
	});

	describe("getValidatedSessionSecret", () => {
		beforeEach(() => {
			jest.resetModules();
		});

		test("valid session secret should be returned", () => {
			const validValue = "i_am_valid";
			process.env.SESSION_SECRET = validValue;

			require("./environment");

			expect(EnvironmentUtils.getValidatedSessionSecret()).toEqual(validValue);
		});

		test("should throw error on invalid env value", () => {
			process.env.SESSION_SECRET = "";

			require("./environment");

			expect(EnvironmentUtils.getValidatedSessionSecret).toThrowError();
		});
	});

	describe("getValidatedDevelopmentEnabledCorsOrigin", () => {
		beforeEach(() => {
			jest.resetModules();
		});

		test("should return the env value when a valid one exists", () => {
			const validValue = "i_am_cors_origin";
			process.env.CORS_ORIGIN = validValue;

			require("./environment");

			expect(EnvironmentUtils.getValidatedCorsOrigin()).toEqual(validValue);
		});

		test("should throw error on invalid env value", () => {
			process.env.CORS_ORIGIN = "";

			require("./environment");

			expect(EnvironmentUtils.getValidatedCorsOrigin).toThrowError();
		});
	});

	describe("getValidatedServerPort", () => {
		beforeEach(() => {
			jest.resetModules();
		});

		test("should return a valid env value", () => {
			const validValue = "1234";
			process.env.SERVER_PORT = validValue;

			require("./environment");

			expect(EnvironmentUtils.getValidatedServerPort()).toEqual(+validValue);
		});

		test("should throw error on invalid env value", () => {
			const invalidValue = "1234a";
			process.env.SERVER_PORT = invalidValue;

			require("./environment");

			expect(EnvironmentUtils.getValidatedServerPort).toThrowError();
		});

		test("should throw error on empty env value", () => {
			process.env.SERVER_PORT = "";

			require("./environment");

			expect(EnvironmentUtils.getValidatedServerPort).toThrowError();
		});
	});

});