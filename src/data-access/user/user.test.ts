/* eslint-disable @typescript-eslint/no-explicit-any */
import { mockDBConfig } from "../../../testing/db-mocks";
import { dBConfig } from "../../config/db-config";
import { IExistingUser, userDBModel } from "../../models/user/user";
import { UserDA } from "./user";

jest.mock("../../config/db-config");

describe("UserDA", () => {
	describe("getUsersFromDB", () => {
		const fakeData: IExistingUser[] = [
			{
				id: 111,
				tag: 222,
				username: "aasdf",
				email: "aa@abc.net",
				password: "password1",
			},
		];

		test("should respond properly when calling w/ username & tag params", done => {

			mockDBConfig(dBConfig, fakeData);

			UserDA.getUsersFromDB(fakeData[0].username, fakeData[0].tag)
				.then(value => {
					expect(value).toEqual(fakeData);
					expect(dBConfig).toHaveBeenCalledWith(userDBModel.table);
					done();
				});
		});

		test("should respond properly when calling w/ username param", done => {

			mockDBConfig(dBConfig, fakeData);

			UserDA.getUsersFromDB(fakeData[0].username)
				.then(value => {
					expect(value).toEqual(fakeData);
					expect(dBConfig).toHaveBeenCalledWith(userDBModel.table);
					done();
				});
		});

		test("should catch db error properly", done => {

			// -- Arrange
			const error = new Error("faily");
			mockDBConfig(dBConfig, error);

			// -- Act
			UserDA.getUsersFromDB(fakeData[0].username)

				// -- Assert
				.then(() => done.fail())
				.catch(error => {
					expect(error).toBeDefined();
					expect(dBConfig).toHaveBeenCalledWith(userDBModel.table);
					done();
				});
		});
	});

	const fakeUsers: IExistingUser[] = [
		{
			id: 11,
			tag: 1111,
			username: "aaaa",
			email: "aa@aaa.net",
			password: "pwd_aa",
		},
		{
			id: 22,
			tag: 2222,
			username: "bbbb",
			email: "bb@bbb.net",
			password: "pwd_bb",
		},
	];

	describe("getUserFromDBByUserId", () => {
		test("should respond properly when 1 user exists", done => {

			// -- Arrange
			mockDBConfig(dBConfig, [fakeUsers[0]]);

			// -- Act
			UserDA.getUserFromDBByUserId(123)

				// -- Assert
				.then(user => {
					expect(user).toEqual(fakeUsers[0]);
					expect(dBConfig).toHaveBeenCalledWith(userDBModel.table);
					done();
				});
		});

		test("should catch error properly when >1 user exists", done => {

			// -- Arrange
			mockDBConfig(dBConfig, fakeUsers);

			// -- Act
			UserDA.getUserFromDBByUserId(123)

				// -- Assert
				.then(() => {
					done.fail("should have caught error");
				})
				.catch(error => {
					expect(error).toEqual("more than 1 user found");
					done();
				});
		});

		test("should catch error properly when >1 user exists", done => {

			// -- Arrange
			mockDBConfig(dBConfig, []);

			// -- Act
			UserDA.getUserFromDBByUserId(123)

				// -- Assert
				.then(() => {
					done.fail("should have caught error");
				})
				.catch(error => {
					expect(error).toEqual("no users found");
					done();
				});
		});
	});

	describe("getUsersFromDBByUserId", () => {
		test("should respond properly when calling w/ user id", done => {
			// -- Arrange
			mockDBConfig(dBConfig, fakeUsers);

			// -- Act
			UserDA.getUsersFromDBByUserId(fakeUsers[0].id)

				// -- Assert
				.then(users => {
					expect(users).toEqual(fakeUsers);
					expect(dBConfig).toHaveBeenCalledWith(userDBModel.table);
					done();
				});
		});

		test("should catch db error properly", done => {

			// -- Arrange
			const error = new Error("faily");
			mockDBConfig(dBConfig, error);

			// -- Act
			UserDA.getUsersFromDBByUserId(123)

				// -- Assert
				.then(() => done.fail())
				.catch(error => {
					expect(error).toBeDefined();
					expect(dBConfig).toHaveBeenCalledWith(userDBModel.table);
					done();
				});
		});
	});

	describe("createNewUser", () => {

		test("should add new user properly", done => {
			// -- Arrange
			mockDBConfig(dBConfig, []); // Will return 0 "same users".
			(dBConfig as any).mockImplementationOnce(() => ({
				where: () => Promise.resolve(fakeUsers)
			}));

			// -- Act
			UserDA.createNewUser(fakeUsers[0])

				// -- Assert
				.then(() => {
					// Should be good without errors.
					expect(dBConfig).toHaveBeenCalledWith(userDBModel.table);
					done();
				});
		});

		test("should catch error on adding duplicate user", done => {
			// -- Arrange
			// Even return users when it's used for checking for "same users".
			mockDBConfig(dBConfig, fakeUsers);

			// -- Act
			UserDA.createNewUser(fakeUsers[0])

				// -- Assert
				.then(() => {
					done.fail("should have caught error");
				})
				.catch(error => {
					expect(error).toEqual("User found with same tag");
					done();
				});
		});
	});
});
