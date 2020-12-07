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
			process.env.DEVELOPMENT_ENABLED_CORS_ORIGIN = validValue;

			require("./environment");

			expect(EnvironmentUtils.getValidatedDevelopmentEnabledCorsOrigin()).toEqual(validValue);
		});

		test("should throw error on invalid env value", () => {
			process.env.DEVELOPMENT_ENABLED_CORS_ORIGIN = "";

			require("./environment");

			expect(EnvironmentUtils.getValidatedDevelopmentEnabledCorsOrigin).toThrowError();
		});
	});

});