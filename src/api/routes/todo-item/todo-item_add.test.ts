import { expressTestHelpers } from "../../../../testing/express-mocks";


const todoItemAddRoute = "/todo-item/add";
describe(todoItemAddRoute, () => {

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
		require("./todo-item");
	
		// Assert
		expect(postSpy).toHaveBeenCalledWith(
			todoItemAddRoute,
			expect.any(Function), // Not really easy way to test func param.
		);
	});
});