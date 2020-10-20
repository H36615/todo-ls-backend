import { mockDBConfig } from "../../../testing/db-mocks";
import { createResMock } from "../../../testing/express-mocks";
import { mockLogger } from "../../../testing/logger-mocks";
import { dBConfig } from "../../config/db-config";
import { logError } from "../../logger/logger";
import { ITodoItem, todoItemDBModel, TodoItemStatus } from "../../models/todo-item/todo-item";
import { getAllTodoItems } from "./todo-item";
/* eslint-disable @typescript-eslint/no-explicit-any */

jest.mock("../../config/db-config");
jest.mock("../../logger/logger");

test("getAllTodoItems should respond w/ correct value(s)", async () => {

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

	// Arrange
	mockLogger(logError);
	mockDBConfig(dBConfig, responseMock);
	const resMock = createResMock();

	// Act
	await getAllTodoItems({} as any, resMock, {} as any);

	// Assert
	expect(logError).not.toHaveBeenCalled();
	expect(resMock.send).toHaveBeenCalledWith(responseMock);
});

test("getAllTodoItems should catch error properly", async () => {

	// -- Arrange
	const error = new Error("rejecty");
	mockLogger(logError);
	mockDBConfig(dBConfig, error);
	const nextSpy: any = jest.fn();

	// -- Act
	await getAllTodoItems({} as any, {} as any, nextSpy);

	// -- Assert
	expect(logError).toHaveBeenCalledWith(error);
	expect(dBConfig).toHaveBeenCalledWith(todoItemDBModel.table);
	// TODO
	// expect(dBConfig.select).toHaveBeenCalledWith();
	expect(nextSpy).toHaveBeenCalledWith(expect.any(Error));
});

test("addTodoItem", () => {
	throw new Error("not implemented");
});
