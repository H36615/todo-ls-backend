import { ExpressTestHelpers } from "../../../../testing/express-mocks";

const todoItemAllRoute = "/todo-item/all";
describe(todoItemAllRoute, () => {

	test("no spy should be called without initialization", () => {

		// Arrange
		const getSpy = jest.fn();
		ExpressTestHelpers.mockExpress(getSpy);

		// Assert
		expect(getSpy).not.toHaveBeenCalled();
	});

	test("route should be initialized", () => {

		// Arrange
		const getSpy = jest.fn();
		ExpressTestHelpers.mockExpress(getSpy);

		// Act
		require("./todo-item");

		// Assert
		expect(getSpy).toHaveBeenCalledWith(
			todoItemAllRoute,
			expect.any(Function), // Not really easy way to test func param.
		);
	});
});