import { expressTestHelpers } from "../../../../testing/express-mocks";


const healthRoute = "/health";
describe(healthRoute, () => {

	test("no spy should be called without initialization", () => {
	
		// Arrange
		const getSpy = jest.fn();
		expressTestHelpers.mockExpress(getSpy);
	
		// Assert
		expect(getSpy).not.toHaveBeenCalled();
	});

	test("route should be initialized", () => {

		// Arrange
		const getSpy = jest.fn();
		expressTestHelpers.mockExpress(getSpy);
	
		// Act
		require("./health");
	
		// Assert
		expect(getSpy).toHaveBeenCalledWith(
			healthRoute,
			expect.any(Function), // Not really easy way to test func param.
		);
	});
});
