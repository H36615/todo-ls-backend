
import { Strategy as JWTStrategy } from "passport-jwt";

function mockPassport(useSpy: jest.Mock | undefined): void {
	jest.doMock(
		"passport",
		() => {
			if (useSpy == undefined) throw new Error("use spy missing");

			return {
				use: useSpy
			};
		}
	);
}

describe("strategies", () => {

	test("no spy should be called without the test entity", () => {

		// Arrange
		const useSpy = jest.fn();
		mockPassport(useSpy);

		// Assert
		expect(useSpy).not.toHaveBeenCalled();
	});

	test("'user' strategy should be configured", () => {

		// Arrange
		const useSpy = jest.fn();
		mockPassport(useSpy);

		// Act
		require("./passport-config");

		// Assert
		expect(useSpy).toHaveBeenCalledWith(
			"user",
			expect.any(JWTStrategy),
		);
	});
});


test("authorization", () => {
	throw new Error("not implemented");
});

