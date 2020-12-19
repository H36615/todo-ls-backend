import { ExpressTestHelpers } from "../../../../testing/express-mocks";

const todoItemAllRoute = "/todo-item/one";
describe(todoItemAllRoute, () => {

	test("no spy should be called without initialization", () => {
		// Arrange
		const deleteSpy = jest.fn();
		ExpressTestHelpers.mockExpress(undefined, undefined, undefined, deleteSpy);

		// Assert
		expect(deleteSpy).not.toHaveBeenCalled();
	});

	test("route should be initialized", () => {
		// Arrange
		const deleteSpy = jest.fn();
		ExpressTestHelpers.mockExpress(undefined, undefined, undefined, deleteSpy);

		// Act
		require("./todo-item");

		// Assert
		expect(deleteSpy).toHaveBeenCalledWith(
			todoItemAllRoute,
			expect.any(Function), // Not really easy way to test func param.
		);
	});
});