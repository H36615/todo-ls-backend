/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExpressTestHelpers, IReqMock } from "../../../testing/express-mocks";
import { UserDA, userFoundByEmailErrorText } from "../../data-access/user/user";
import { IExistingUser, newUserValidator } from "../../models/user/user";
import { AuthUtils } from "../../utils/auth/auth";
import { Logger } from "../../utils/logger/logger";
import { ResponseType } from "../interfaces";
import { registerUser, sessionIsValid } from "./user";

jest.mock("../../models/user/user");

describe("user controller", () => {
	describe("registerUser", () => {
		test("should register user properly w/ correct value(s)", async () => {
			// -- Arrange
			const reqMock: IReqMock = { body: { anything: "yes" } };
			const resMock = ExpressTestHelpers.createResMock();
			const nextSpy: any = jest.fn();

			jest.spyOn(newUserValidator, "validateAsync").mockImplementation(
				() => Promise.resolve("anything")
			);
			jest.spyOn(Logger, "error");
			jest.spyOn(UserDA, "createNewUser").mockImplementation(
				(): Promise<number[]> => Promise.resolve([])
			);

			// -- Act
			await registerUser(reqMock as any, resMock, nextSpy);

			// -- Assert
			expect(Logger.error).not.toHaveBeenCalled();
			expect(nextSpy).not.toHaveBeenCalled();
			expect(resMock.json).toHaveBeenCalledWith(ResponseType.UserCreated);
		});

		test("should catch validation error properly", async () => {
			// -- Arrange
			const errorMessage = "faily";
			const reqMock: IReqMock = { body: { anything: "yes" } };
			const resMock = ExpressTestHelpers.createResMock();
			const nextSpy: any = jest.fn();

			jest.spyOn(newUserValidator, "validateAsync").mockImplementation(
				() => Promise.reject(errorMessage)
			);
			jest.spyOn(Logger, "error");
			jest.spyOn(UserDA, "createNewUser").mockImplementation(
				(): Promise<number[]> => Promise.resolve([])
			);

			// -- Act
			await registerUser(reqMock as any, resMock, nextSpy);

			// -- Assert
			expect(resMock.send).not.toHaveBeenCalled();
			expect(UserDA.createNewUser).not.toHaveBeenCalled();
			expect(Logger.error).toHaveBeenCalled();
			expect(resMock.status).toHaveBeenCalledWith(422);
			expect(nextSpy).toHaveBeenCalledWith(errorMessage);
		});

		test("should catch existing email data access error properly", async () => {
			// -- Arrange
			const validatedValue = "validated value";
			const reqMock: IReqMock = { body: { anything: "yes" } };
			const resMock = ExpressTestHelpers.createResMock();
			const nextSpy: any = jest.fn();

			jest.spyOn(newUserValidator, "validateAsync").mockImplementation(
				() => Promise.resolve(validatedValue)
			);
			jest.spyOn(Logger, "error");
			jest.spyOn(UserDA, "createNewUser").mockImplementation(
				(): Promise<number[]> => Promise.reject(userFoundByEmailErrorText)
			);

			// -- Act
			await registerUser(reqMock as any, resMock, nextSpy);

			// -- Assert
			expect(resMock.send).not.toHaveBeenCalled();
			expect(UserDA.createNewUser).toHaveBeenCalledWith(validatedValue);
			expect(Logger.error).toHaveBeenCalled();
			expect(resMock.status).toHaveBeenCalledWith(409);
			expect(nextSpy).toHaveBeenCalledWith(userFoundByEmailErrorText);
		});

		test("should catch other data access error properly", async () => {
			// -- Arrange
			const errorMessage = "faily";
			const validatedValue = "validated value";
			const reqMock: IReqMock = { body: { anything: "yes" } };
			const resMock = ExpressTestHelpers.createResMock();
			const nextSpy: any = jest.fn();

			jest.spyOn(newUserValidator, "validateAsync").mockImplementation(
				() => Promise.resolve(validatedValue)
			);
			jest.spyOn(Logger, "error");
			jest.spyOn(UserDA, "createNewUser").mockImplementation(
				(): Promise<number[]> => Promise.reject(errorMessage)
			);

			// -- Act
			await registerUser(reqMock as any, resMock, nextSpy);

			// -- Assert
			expect(resMock.send).not.toHaveBeenCalled();
			expect(UserDA.createNewUser).toHaveBeenCalledWith(validatedValue);
			expect(Logger.error).toHaveBeenCalled();
			expect(nextSpy).toHaveBeenCalledWith("Other error");
		});
	});

	describe("sessionIsValid", () => {

		const fakeUserInfo: Pick<IExistingUser, "username" | "id" | "tag"> = {
			username: "yeah",
			id: 123,
			tag: 456,
		};

		test("should respond properly when authentication succeeds", async () => {
			// -- Arrange
			const authenticated = true;
			const reqMock: IReqMock = { body: { user: fakeUserInfo } };
			const resMock = ExpressTestHelpers.createResMock();
			const nextSpy: any = jest.fn();

			jest.spyOn(AuthUtils, "isAuthenticated").mockImplementation(
				(): boolean => authenticated
			);
			jest.spyOn(AuthUtils, "stripUserInfo").mockImplementation(
				(): Pick<IExistingUser, "username" | "id" | "tag"> => fakeUserInfo
			);
			jest.spyOn(Logger, "error");

			// -- Act
			await sessionIsValid(reqMock as any, resMock, nextSpy);

			// -- Assert
			expect(resMock.json).toHaveBeenCalledWith(fakeUserInfo);
			expect(Logger.error).not.toHaveBeenCalled();
			expect(nextSpy).not.toHaveBeenCalled();
		});

		test.skip("should respond properly when authentication fails", async () => {
			// -- Arrange
			const notAuthenticated = false;
			const reqMock: IReqMock = { body: { user: fakeUserInfo } };
			const resMock = ExpressTestHelpers.createResMock();
			const nextSpy: any = jest.fn();

			jest.spyOn(AuthUtils, "isAuthenticated").mockImplementation(
				(): boolean => notAuthenticated
			);
			jest.spyOn(AuthUtils, "stripUserInfo").mockImplementation(
				(): Pick<IExistingUser, "username" | "id" | "tag"> => fakeUserInfo
			);
			jest.spyOn(Logger, "error");

			// -- Act
			await sessionIsValid(reqMock as any, resMock, nextSpy);

			// -- Assert
			expect(resMock.status).toHaveBeenCalledWith(401);
			expect(resMock.json).toHaveBeenCalledWith(false);
			expect(Logger.error).not.toHaveBeenCalled();
			expect(nextSpy).not.toHaveBeenCalled();
		});
	});
});