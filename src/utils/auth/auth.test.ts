/* eslint-disable @typescript-eslint/no-explicit-any */
import { mockDBConfig } from "../../../testing/db-mocks";
import { dBConfig } from "../../config/db-config";
import {
	IExistingUser, ILoginInformation, loginInformationValidator, userDBModel
} from "../../models/user/user";
import { compare } from "bcrypt";
import { AuthUtils } from "./auth";
import { ExpressTestHelpers } from "../../../testing/express-mocks";
import { Logger } from "../logger/logger";

jest.mock("../../config/db-config");
jest.mock("bcrypt");

describe("AuthUtils", () => {
	describe("isAuthenticatedWithLoginInfo", () => {
		const dbConfigResults: Array<IExistingUser> = [
			{
				id: 11,
				tag: 1111,
				username: "a",
				email: "a@a.net",
				password: "aa",
			},
			{
				id: 22,
				tag: 2222,
				username: "b",
				email: "b@b.net",
				password: "bb",
			}
		];

		test("should authenticate properly", done => {
			// -- Arrange
			const matchingUser: IExistingUser = dbConfigResults[1];
			const loginInfo: ILoginInformation = {
				email: matchingUser.email,
				password: matchingUser.password,
			};
			const hashMatches = true;
			jest.spyOn(loginInformationValidator, "validateAsync").mockImplementation(
				(): Promise<ILoginInformation> => Promise.resolve(matchingUser)
			);
			mockDBConfig(dBConfig, [matchingUser]);
			(compare as any).mockImplementation(
				(): Promise<boolean> => Promise.resolve(hashMatches)
			);

			// -- Act
			AuthUtils.isAuthenticatedWithLoginInfo(loginInfo)

				// -- Assert
				.then((response: number) => {
					expect(response).toEqual(matchingUser.id);
					expect(loginInformationValidator.validateAsync).toHaveBeenCalledWith(loginInfo);
					expect(dBConfig).toHaveBeenCalledWith(userDBModel.table);
					expect(compare).toHaveBeenCalledWith(loginInfo.password, matchingUser.password);
					done();
				});
		});

		test("should catch validation error properly", done => {
			// -- Arrange
			const errorMessage = "faily";
			const matchingUser: IExistingUser = dbConfigResults[1];
			const loginInfo: ILoginInformation = {
				email: matchingUser.email,
				password: matchingUser.password,
			};
			const hashMatches = true;
			jest.spyOn(loginInformationValidator, "validateAsync").mockImplementation(
				(): Promise<ILoginInformation> => Promise.reject(errorMessage)
			);
			mockDBConfig(dBConfig, [matchingUser]);
			(compare as any).mockImplementation(
				(): Promise<boolean> => Promise.resolve(hashMatches)
			);

			// -- Act
			AuthUtils.isAuthenticatedWithLoginInfo(loginInfo)

				// -- Assert
				.then(() => {
					done.fail("should have already been rejected");
				})
				.catch(error => {
					expect(error).toEqual(errorMessage);
					expect(loginInformationValidator.validateAsync).toHaveBeenCalledWith(loginInfo);
					expect(dBConfig).not.toHaveBeenCalled();
					expect(compare).not.toHaveBeenCalled();
					done();
				});
		});

		test("should catch Data access error properly", done => {
			// -- Arrange
			const errorMessage = "faily";
			const matchingUser: IExistingUser = dbConfigResults[1];
			const loginInfo: ILoginInformation = {
				email: matchingUser.email,
				password: matchingUser.password,
			};
			const hashMatches = true;
			jest.spyOn(loginInformationValidator, "validateAsync").mockImplementation(
				(): Promise<ILoginInformation> => Promise.resolve(matchingUser)
			);
			mockDBConfig(dBConfig, new Error(errorMessage));
			(compare as any).mockImplementation(
				(): Promise<boolean> => Promise.resolve(hashMatches)
			);

			// -- Act
			AuthUtils.isAuthenticatedWithLoginInfo(loginInfo)

				// -- Assert
				.then(() => {
					done.fail("should have already been rejected");
				})
				.catch(error => {
					expect(error).toEqual(new Error(errorMessage));
					expect(loginInformationValidator.validateAsync).toHaveBeenCalledWith(loginInfo);
					expect(dBConfig).toHaveBeenCalledWith(userDBModel.table);
					expect(compare).not.toHaveBeenCalled();
					done();
				});
		});

		test("should catch hash comparison error properly", done => {
			// -- Arrange
			const errorMessage = "faily";
			const matchingUser: IExistingUser = dbConfigResults[1];
			const loginInfo: ILoginInformation = {
				email: matchingUser.email,
				password: matchingUser.password,
			};
			jest.spyOn(loginInformationValidator, "validateAsync").mockImplementation(
				(): Promise<ILoginInformation> => Promise.resolve(matchingUser)
			);
			mockDBConfig(dBConfig, [matchingUser]);
			(compare as any).mockImplementation(
				(): Promise<boolean> => Promise.reject(errorMessage)
			);

			// -- Act
			AuthUtils.isAuthenticatedWithLoginInfo(loginInfo)

				// -- Assert
				.then(() => {
					done.fail("should have already been rejected");
				})
				.catch(error => {
					expect(error).toEqual(errorMessage);
					expect(loginInformationValidator.validateAsync).toHaveBeenCalledWith(loginInfo);
					expect(dBConfig).toHaveBeenCalledWith(userDBModel.table);
					expect(compare).toHaveBeenCalledWith(loginInfo.password, matchingUser.password);
					done();
				});
		});
	});

	describe("sessionIsAuthenticated", () => {
		test("should authenticate properly", () => {
			// -- Arrange
			const reqMock: any = { isAuthenticated: () => "any valuez" };
			const resMock = ExpressTestHelpers.createResMock();
			const nextSpy: any = jest.fn();

			// -- Act
			AuthUtils.sessionIsAuthenticated(reqMock as any, resMock, nextSpy);

			// -- Assert
			expect(nextSpy).toHaveBeenCalledWith();
		});

		test("should cause error when unauthenticated", () => {
			// -- Arrange
			// Return null i.e. not authenticated.
			const reqMock: any = { isAuthenticated: () => null };
			const resMock = ExpressTestHelpers.createResMock();
			const nextSpy: any = jest.fn();

			// -- Act
			AuthUtils.sessionIsAuthenticated(reqMock as any, resMock, nextSpy);

			// -- Assert
			expect(nextSpy).toHaveBeenCalledWith(new Error("User authentication failed"));
		});
	});

	describe("getUserIdFromSession", () => {
		test("should get user from session properly", done => {
			// -- Arrange
			const sessionUser: Pick<IExistingUser, "id"> = { id: 123 };
			const reqMock: any = { user: sessionUser };

			// -- Act & Assert
			AuthUtils.getUserIdFromSession(reqMock)
				.then(userId => {
					expect(userId).toEqual(sessionUser.id);
					done();
				});
		});

		test("should reject properly when user id does not exist", done => {
			// -- Arrange
			const sessionUser = {};
			const reqMock: any = { user: sessionUser };

			jest.spyOn(Logger, "error");

			// -- Act & Assert
			AuthUtils.getUserIdFromSession(reqMock)
				.catch(error => {
					expect(error).toEqual("user id not found from the session");
					expect(Logger.error).toHaveBeenCalledWith("user id not found from the session");
					done();
				});
		});
	});
});
