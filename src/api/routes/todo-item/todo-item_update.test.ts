import { ExpressTestHelpers } from "../../../../testing/express-mocks";

const todoItemAllRoute = "/todo-item/update";
describe(todoItemAllRoute, () => {

	test("no spy should be called without initialization", () => {
		// Arrange
		const putSpy = jest.fn();
		ExpressTestHelpers.mockExpress(undefined, undefined, putSpy);

		// Assert
		expect(putSpy).not.toHaveBeenCalled();
	});

	test("route should be initialized", () => {
		// Arrange
		const putSpy = jest.fn();
		ExpressTestHelpers.mockExpress(undefined, undefined, putSpy);

		// Act
		require("./todo-item");

		// Assert
		expect(putSpy).toHaveBeenCalledWith(
			todoItemAllRoute,
			expect.any(Function), // Not really easy way to test func param.
		);
	});
});