import { Enviroment, EnviromentUtils } from "./enviroment";

describe("enviroment utils", () => {
	describe("getValidatedEnviroment", () => {
		beforeEach(() => {
			jest.resetModules();
		});

		[
			Enviroment.development,
			Enviroment.production,
		]
			.forEach(testableValue => {
				test(testableValue + " should be valid", () => {
					process.env.ENVIROMENT = testableValue;

					require("./enviroment");

					expect(EnviromentUtils.getValidatedEnviroment()).toEqual(testableValue);
				});
			});

		[
			undefined,
			"asbaasdfsfdsfd",
		]
			.forEach(testableValue => {
				test(testableValue + " should be invalid", () => {
					process.env.ENVIROMENT = testableValue;

					require("./enviroment");

					expect(EnviromentUtils.getValidatedEnviroment).toThrowError();
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

			require("./enviroment");

			expect(EnviromentUtils.getValidatedSessionSecret()).toEqual(validValue);
		});

		test("valid session secret should be returned", () => {
			process.env.SESSION_SECRET = "";

			require("./enviroment");

			expect(EnviromentUtils.getValidatedSessionSecret).toThrowError();
		});
	});
});