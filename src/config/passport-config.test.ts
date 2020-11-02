
import { Strategy as LocalStrategy } from "passport-local";
import passportConfig from "passport";

test("no spy should be called without the test entity", () => {

	// Arrange
	jest.spyOn(passportConfig, "use");
	jest.spyOn(passportConfig, "serializeUser");
	jest.spyOn(passportConfig, "deserializeUser");

	// Assert
	expect(passportConfig.serializeUser).not.toHaveBeenCalled();
	expect(passportConfig.deserializeUser).not.toHaveBeenCalled();
});

test("passport should be set up", () => {

	// Arrange
	jest.spyOn(passportConfig, "use");
	jest.spyOn(passportConfig, "serializeUser");
	jest.spyOn(passportConfig, "deserializeUser");

	// Act
	require("./passport-config");

	// Assert
	expect(passportConfig.serializeUser).toHaveBeenCalledWith(
		expect.any(Function),
	);
	expect(passportConfig.deserializeUser).toHaveBeenCalledWith(
		expect.any(Function),
	);
	expect(passportConfig.use).toHaveBeenCalledWith(
		"login",
		expect.any(LocalStrategy),
	);
});
