import { ExpressTestHelpers } from "../../../../testing/express-mocks";
import { passportConfig } from "../../../config/passport-config";
import { AuthUtils } from "../../../utils/auth/auth";


describe("Routes", () => {

	test("no spy should be called without initialization", () => {

		// Arrange
		const postSpy = jest.fn();
		ExpressTestHelpers.mockExpress(undefined, postSpy);
		jest.spyOn(passportConfig, "authenticate");

		// Assert
		expect(postSpy).not.toHaveBeenCalled();
		expect(passportConfig.authenticate).not.toHaveBeenCalled();
	});

	test("routes should be initialized", () => {

		// Arrange
		const getSpy = jest.fn();
		const postSpy = jest.fn();
		ExpressTestHelpers.mockExpress(getSpy, postSpy);
		const registerUserRoute = "/register";
		const loginUserRoute = "/login";
		const validSessionRoute = "/valid-session";
		jest.spyOn(passportConfig, "authenticate");

		// Act
		require("./user");

		// Assert
		expect(postSpy).toHaveBeenCalledWith(
			registerUserRoute,
			expect.any(Function), // Not really easy way to test func param.
		);
		expect(postSpy).toHaveBeenCalledWith(
			loginUserRoute,
			expect.any(Function), // Authenticator
			expect.any(Function),
		);
		expect(getSpy).toHaveBeenCalledWith(
			validSessionRoute,
			AuthUtils.sessionIsAuthenticated,
			expect.any(Function),
		);
		expect(passportConfig.authenticate).toHaveBeenCalled();
	});
});