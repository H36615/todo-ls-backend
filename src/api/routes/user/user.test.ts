import { expressTestHelpers } from "../../../../testing/express-mocks";

const registerUserRoute = "/user/register";
describe(registerUserRoute, () => {

	test("no spy should be called without initialization", () => {

		// Arrange
		const postSpy = jest.fn();
		expressTestHelpers.mockExpress(undefined, postSpy);

		// Assert
		expect(postSpy).not.toHaveBeenCalled();
	});

	test("route should be initialized", () => {

		// Arrange
		const postSpy = jest.fn();
		expressTestHelpers.mockExpress(undefined, postSpy);

		// Act
		require("./user");

		// Assert
		expect(postSpy).toHaveBeenCalledWith(
			registerUserRoute,
			expect.any(Function), // Not really easy way to test func param.
		);
	});
});