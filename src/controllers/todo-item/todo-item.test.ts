import { mockDBConfig } from "../../../testing/db-mocks";
import { ExpressTestHelpers, IReqMock } from "../../../testing/express-mocks";
import { mockLogger } from "../../../testing/logger-mocks";
import { dBConfig } from "../../config/db-config";
import { logError } from "../../logger/logger";
import {
	ITodoItem, todoItemDBModel, TodoItemStatus, todoItemValidator
} from "../../models/todo-item/todo-item";
import { getResponseValue, ResponseType } from "../interfaces";
import { addTodoItem, getAllTodoItems } from "./todo-item";
/* eslint-disable @typescript-eslint/no-explicit-any */

jest.mock("../../config/db-config");
jest.mock("../../logger/logger");
jest.mock("../../models/todo-item/todo-item");

describe("getAllTodoItems", () => {

	test("should respond w/ correct value(s)", async () => {

		// -- Arrange
		const responseMock: ITodoItem[] = [
			{
				id: 10,
				status: TodoItemStatus.inProgres,
				task: "do a thing",
				user_id: 20,
			},
			{
				id: 11,
				status: TodoItemStatus.delayed,
				task: "make that",
				user_id: 21,
			}
		];
		mockLogger(logError);
		mockDBConfig(dBConfig, responseMock);
		const resMock = ExpressTestHelpers.createResMock();

		// -- Act
		await getAllTodoItems({} as any, resMock, {} as any);

		// -- Assert
		expect(logError).not.toHaveBeenCalled();
		// TODO
		// expect(dBConfig.select).toHaveBeenCalledWith(...);
		expect(resMock.send).toHaveBeenCalledWith(responseMock);
	});

	test("should catch error properly", async () => {

		// -- Arrange
		const error = new Error("rejecty");
		mockLogger(logError);
		mockDBConfig(dBConfig, error);
		const nextSpy: any = jest.fn();

		// -- Act
		await getAllTodoItems({} as any, {} as any, nextSpy);

		// -- Assert
		expect(dBConfig).toHaveBeenCalledWith(todoItemDBModel.table);
		// TODO
		// expect(dBConfig.select).not.toHaveBeenCalled();
		expect(logError).toHaveBeenCalledWith(error);
		expect(nextSpy).toHaveBeenCalledWith(error);
	});
});

describe("addTodoItem", () => {

	test("should add properly", async () => {

		// -- Arrange
		const fakeValidatedValue = "fake validated value";
		mockLogger(logError);
		mockDBConfig(dBConfig, { value: "todo change this" });
		jest.spyOn(todoItemValidator, "validateAsync").mockImplementation(
			(): Promise<string> => Promise.resolve(fakeValidatedValue)
		);

		const nextSpy: any = jest.fn();
		const resMock = ExpressTestHelpers.createResMock();
		const reqMock: IReqMock = { body: { anything: "yes" } };

		// -- Act
		await addTodoItem(reqMock as any, resMock, nextSpy);

		// -- Assert
		expect(logError).not.toHaveBeenCalled();
		expect(todoItemValidator.validateAsync).toHaveBeenCalledWith(reqMock.body);
		expect(dBConfig).toHaveBeenCalledWith(todoItemDBModel.table);
		expect(resMock.send).toHaveBeenCalledWith(
			getResponseValue(ResponseType.OK)
		);
	});

	test("should catch error properly", async () => {

		// -- Arrange
		const fakeValidatedValue = "fake validated value";
		const error = new Error("rejecty 2");
		mockLogger(logError);
		mockDBConfig(dBConfig, error);
		jest.spyOn(todoItemValidator, "validateAsync").mockImplementation(
			(): Promise<string> => Promise.resolve(fakeValidatedValue)
		);

		const nextSpy: any = jest.fn();
		const resMock = ExpressTestHelpers.createResMock();
		const reqMock: IReqMock = { body: { anything: "yes" } };

		// -- Act
		await addTodoItem(reqMock as any, resMock, nextSpy);

		// -- Assert
		expect(todoItemValidator.validateAsync).toHaveBeenCalledWith(reqMock.body);
		expect(dBConfig).toHaveBeenCalledWith(todoItemDBModel.table);
		expect(resMock.send).not.toHaveBeenCalled();
		
		expect(logError).toHaveBeenCalledWith(error);
		expect(nextSpy).toHaveBeenCalledWith(error);
	});
});