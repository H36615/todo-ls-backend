import { mockDBConfig } from "../../../testing/db-mocks";
import { ExpressTestHelpers, IReqMock } from "../../../testing/express-mocks";
import { dBConfig } from "../../config/db-config";
import { Logger } from "../../utils/logger/logger";
import {
	ITodoItem, todoItemDBModel, TodoItemStatus, newTodoItemValidator
} from "../../models/todo-item/todo-item";
import { getResponseValue, ResponseType } from "../interfaces";
import { addTodoItem, getAllTodoItems } from "./todo-item";
/* eslint-disable @typescript-eslint/no-explicit-any */

jest.mock("../../config/db-config");
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

		jest.spyOn(Logger, "error");
		mockDBConfig(dBConfig, responseMock);
		const resMock = ExpressTestHelpers.createResMock();

		// -- Act
		await getAllTodoItems({} as any, resMock, {} as any);

		// -- Assert
		expect(Logger.error).not.toHaveBeenCalled();
		// TODO
		// expect(dBConfig.select).toHaveBeenCalledWith(...);
		expect(resMock.send).toHaveBeenCalledWith(responseMock);
	});

	test("should catch error properly", async () => {
		// -- Arrange
		const error = new Error("rejecty");

		jest.spyOn(Logger, "error");
		mockDBConfig(dBConfig, error);
		const nextSpy: any = jest.fn();

		// -- Act
		await getAllTodoItems({} as any, {} as any, nextSpy);

		// -- Assert
		expect(dBConfig).toHaveBeenCalledWith(todoItemDBModel.table);
		// TODO
		// expect(dBConfig.select).not.toHaveBeenCalled();
		expect(Logger.error).toHaveBeenCalledWith(error);
		expect(nextSpy).toHaveBeenCalledWith(error);
	});
});

describe("addTodoItem", () => {
	test("should add properly", async () => {
		// -- Arrange
		const fakeValidatedValue = "fake validated value";

		jest.spyOn(Logger, "error");
		mockDBConfig(dBConfig, { value: "todo change this" });
		jest.spyOn(newTodoItemValidator, "validateAsync").mockImplementation(
			(): Promise<string> => Promise.resolve(fakeValidatedValue)
		);

		const nextSpy: any = jest.fn();
		const resMock = ExpressTestHelpers.createResMock();
		const reqMock: IReqMock = { body: { anything: "yes" } };

		// -- Act
		await addTodoItem(reqMock as any, resMock, nextSpy);

		// -- Assert
		expect(Logger.error).not.toHaveBeenCalled();
		expect(newTodoItemValidator.validateAsync).toHaveBeenCalledWith(reqMock.body);
		expect(dBConfig).toHaveBeenCalledWith(todoItemDBModel.table);
		expect(resMock.send).toHaveBeenCalledWith(
			getResponseValue(ResponseType.OK)
		);
	});

	test("should catch error properly", async () => {
		// -- Arrange
		const fakeValidatedValue = "fake validated value";
		const error = new Error("rejecty 2");

		jest.spyOn(Logger, "error");
		mockDBConfig(dBConfig, error);
		jest.spyOn(newTodoItemValidator, "validateAsync").mockImplementation(
			(): Promise<string> => Promise.resolve(fakeValidatedValue)
		);

		const nextSpy: any = jest.fn();
		const resMock = ExpressTestHelpers.createResMock();
		const reqMock: IReqMock = { body: { anything: "yes" } };

		// -- Act
		await addTodoItem(reqMock as any, resMock, nextSpy);

		// -- Assert
		expect(newTodoItemValidator.validateAsync).toHaveBeenCalledWith(reqMock.body);
		expect(dBConfig).toHaveBeenCalledWith(todoItemDBModel.table);
		expect(resMock.send).not.toHaveBeenCalled();
		
		expect(Logger.error).toHaveBeenCalledWith(error);
		expect(nextSpy).toHaveBeenCalledWith(error);
	});
});