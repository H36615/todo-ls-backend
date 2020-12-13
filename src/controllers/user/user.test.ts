/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExpressTestHelpers, IReqMock } from "../../../testing/express-mocks";
import { UserDA, userFoundByEmailErrorText } from "../../data-access/user/user";
import { newUserValidator } from "../../models/user/user";
import { Logger } from "../../utils/logger/logger";
import { ResponseType } from "../interfaces";
import { registerUser } from "./user";

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
});