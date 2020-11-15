import { Logger } from "./logger";

describe("logger", () => {
	
	afterEach(() => {
		jest.resetModules();
	});

	test("error", () => {
		jest.spyOn(console, "log");
		const errorMessage = "faily";

		Logger.error(errorMessage);

		expect(console.log).toHaveBeenCalledWith("Error: " + errorMessage);
	});

	test("debug", () => {
		jest.spyOn(console, "log");
		const message = "lemons";

		Logger.debug(message);

		expect(console.log).toHaveBeenCalledWith(message);
	});
});
