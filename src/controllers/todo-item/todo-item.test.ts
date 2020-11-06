import { mockDBConfig } from "../../../testing/db-mocks";
import { ExpressTestHelpers, IReqMock } from "../../../testing/express-mocks";
import { dBConfig } from "../../config/db-config";
import { Logger } from "../../utils/logger/logger";
import {
	ITodoItem, todoItemDBModel, TodoItemStatus, newTodoItemValidator, INewTodoItem
} from "../../models/todo-item/todo-item";
import { getResponseValue, ResponseType } from "../interfaces";
import { addTodoItem, getAllTodoItems } from "./todo-item";
import { AuthUtils } from "../../utils/user/user";
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
		const filteredResponseMock = responseMock.map(
			(row: ITodoItem) => {
				const mapItem: Pick<INewTodoItem, "task" | "status"> = {
					task: row.task,
					status: row.status,
				};
				return mapItem;
			}
		);
		const fakeUserId = 123;
		const reqMock: IReqMock = { body: { anything: "yes" } };
		const resMock = ExpressTestHelpers.createResMock();
		const nextSpy: any = jest.fn();

		jest.spyOn(Logger, "error");
		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.resolve(fakeUserId)
		);
		mockDBConfig(dBConfig, responseMock);

		// -- Act
		await getAllTodoItems(reqMock as any, resMock, nextSpy);

		// -- Assert
		expect(Logger.error).not.toHaveBeenCalled();
		// TODO
		// expect(dBConfig.select).toHaveBeenCalledWith(...);
		expect(resMock.send).toHaveBeenCalledWith(filteredResponseMock);
		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalledWith(reqMock);
	});

	test("should catch error properly on db error", async () => {
		// -- Arrange
		const error = new Error("rejecty");
		const fakeUserId = 123;
		const nextSpy: any = jest.fn();

		jest.spyOn(Logger, "error");
		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.resolve(fakeUserId)
		);
		mockDBConfig(dBConfig, error);

		// -- Act
		await getAllTodoItems({} as any, {} as any, nextSpy);

		// -- Assert
		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalled();
		expect(dBConfig).toHaveBeenCalledWith(todoItemDBModel.table);
		// TODO
		// expect(dBConfig.select).not.toHaveBeenCalled();
		expect(Logger.error).toHaveBeenCalledWith(error);
		expect(nextSpy).toHaveBeenCalledWith(error);
	});

	test("should catch error on validation", async () => {
		throw new Error("not implemented");
	});

	test("should catch error on user id session authentication", async () => {
		throw new Error("not implemented");
	});
});

describe("addTodoItem", () => {
	test("should add properly", async () => {
		// -- Arrange
		const fakeValidatedValue = "fake validated value";
		const fakeUserId = 321;

		jest.spyOn(Logger, "error");
		mockDBConfig(dBConfig, { value: "todo change this" });
		jest.spyOn(newTodoItemValidator, "validateAsync").mockImplementation(
			(): Promise<string> => Promise.resolve(fakeValidatedValue)
		);
		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.resolve(fakeUserId)
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
		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalledWith(reqMock);
	});

	test("should catch error properly on db error", async () => {
		// -- Arrange
		const fakeValidatedValue = "fake validated value";
		const error = new Error("rejecty 2");
		const fakeUserId = 321;

		jest.spyOn(Logger, "error");
		mockDBConfig(dBConfig, error);
		jest.spyOn(newTodoItemValidator, "validateAsync").mockImplementation(
			(): Promise<string> => Promise.resolve(fakeValidatedValue)
		);
		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.resolve(fakeUserId)
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
		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalledWith(reqMock);
	});

	test("should catch error on validation", async () => {
		throw new Error("not implemented");
	});

	test("should catch error on user id session authentication", async () => {
		throw new Error("not implemented");
	});
});