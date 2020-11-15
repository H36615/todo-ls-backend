/* eslint-disable @typescript-eslint/no-explicit-any */
import { INewUser, loginInformationValidator, newUserValidator, userDBModel } from "./user";
import { ValidationError } from "joi";

test("test that columns' key name and value match", () => {
	// Arrange
	const columnNames = Object.keys(userDBModel.columns);
	const columnValues = Object.values(userDBModel.columns);

	// Act + Assert
	for (let i = 0; i < columnNames.length; i++) {
		// We want to make sure db namings match interface properties.
		expect(columnNames[i]).toEqual(columnValues[i]);
	}
});

describe("newUserValidator", () => {
	test("test that interface and validator have matching properties", () => {
		// Arrange
		const newUserInterfaceKeys = Object.values(userDBModel.columns)
			.filter(key =>
				// filter out properties not present in the interface
				key !== userDBModel.columns.id
				&& key !== userDBModel.columns.tag
			);
		const validatorKeys = Object.keys(newUserValidator.describe().keys);

		// Act
		expect(newUserInterfaceKeys).toEqual(validatorKeys);
	});

	describe("validation", () => {

		const validUsername = "a";
		const validEmail = "aa@aa.net";
		const validPassword = "123456";

		const validItems: Array<INewUser> = [
			{
				username: validUsername,
				email: validEmail,
				password: validPassword,
			},
			{
				username: Array(32).join("a"),
				email: validEmail,
				password: validPassword,
			},
			{
				username: validUsername,
				email: validEmail,
				password: Array(512).join("a"),
			},
		];
		const invalidItems: Array<INewUser> = [
			{
				username: "",
				email: validEmail,
				password: validPassword,
			},
			{
				username: Array(34).join("b"),
				email: validEmail,
				password: validPassword,
			},
			{
				username: ",a",
				email: validEmail,
				password: validPassword,
			},
			{
				username: "ää",
				email: validEmail,
				password: validPassword,
			},
			{
				username: 123 as any,
				email: validEmail,
				password: validPassword,
			},
			{
				username: validUsername,
				email: "bad@email",
				password: validPassword,
			},
			{
				username: validUsername,
				email: "",
				password: validPassword,
			},
			{
				username: validUsername,
				email: undefined as any,
				password: validPassword,
			},
			{
				username: validUsername,
				email: validEmail,
				password: "12345",
			},
			{
				username: validUsername,
				email: validEmail,
				password: undefined as any,
			},
			{
				username: validUsername,
				email: validEmail,
				password: Array(514).join("b"),
			},
		];

		// -- Act & Assert
		validItems.forEach((item: INewUser) => {
			test("item (username: " + item.username + ") should pass validation", () => {
				return newUserValidator.validateAsync(item)
					.then(validatedValue => {
						expect(validatedValue).toEqual(item);
					});
			});
		});
		invalidItems.forEach((item: INewUser) => {
			test("item (username: " + item.username + ") should be rejected", () => {
				return newUserValidator.validateAsync(item)
					.then(() => {
						return Promise.reject("should have already been rejected");
					})
					.catch(error => {
						expect(error).toBeInstanceOf(ValidationError);
					});
			});
		});
	});
});

describe("loginInformationValidator", () => {
	test("test that interface and validator have matching properties", () => {
		// Arrange
		const interfaceKeys = Object.values(userDBModel.columns)
			.filter(key =>
				// filter out properties not present in new user interface
				key !== userDBModel.columns.id
				&& key !== userDBModel.columns.tag
				&& key !== userDBModel.columns.username
			);
		const validatorKeys = Object.keys(loginInformationValidator.describe().keys);

		// Act
		expect(interfaceKeys).toEqual(validatorKeys);
	});

	// Same validators tested above, in 'newUserValidator' tests.a
});