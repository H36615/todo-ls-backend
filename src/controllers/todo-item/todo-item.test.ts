import { ExpressTestHelpers, IReqMock } from "../../../testing/express-mocks";
import { Logger } from "../../utils/logger/logger";
import {
	ITodoItem, TodoItemStatus, newTodoItemValidator, INewTodoItem
} from "../../models/todo-item/todo-item";
import { getResponseValue, ResponseType } from "../interfaces";
import { addTodoItem, getAllTodoItems } from "./todo-item";
import { AuthUtils } from "../../utils/user/user";
import { TodoItemDA } from "../../data-access/todo-item/todo-item";
/* eslint-disable @typescript-eslint/no-explicit-any */

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
		jest.spyOn(TodoItemDA, "getAllMapped").mockImplementation(
			(): Promise<Pick<INewTodoItem, "task" | "status">[]> =>
				Promise.resolve(filteredResponseMock)
		);

		// -- Act
		await getAllTodoItems(reqMock as any, resMock, nextSpy);

		// -- Assert
		expect(Logger.error).not.toHaveBeenCalled();
		expect(resMock.send).toHaveBeenCalledWith(filteredResponseMock);
		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalledWith(reqMock);
	});

	test("should catch data access error properly", async () => {

		const fakeUserId = 123;
		const error = new Error("rejecty");
		const reqMock: IReqMock = { body: { anything: "yes" } };
		const resMock = ExpressTestHelpers.createResMock();
		const nextSpy: any = jest.fn();

		jest.spyOn(Logger, "error");
		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.resolve(fakeUserId)
		);
		jest.spyOn(TodoItemDA, "getAllMapped").mockImplementation(
			(): Promise<Pick<INewTodoItem, "task" | "status">[]> =>
				Promise.reject(error)
		);

		await getAllTodoItems(reqMock as any, resMock, nextSpy);

		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalledWith(reqMock);
		expect(TodoItemDA.getAllMapped).toHaveBeenCalledWith(fakeUserId);
		expect(Logger.error).toHaveBeenCalledWith(error);
		expect(nextSpy).toHaveBeenCalledWith(error);
	});

	test("should catch user id session authentication error properly", async () => {
		throw new Error("not implemented");
	});
});

describe("addTodoItem", () => {
	test("should add properly", async () => {
		// -- Arrange
		const fakeValidatedValue: Omit<INewTodoItem, "user_id"> = {
			task: "tasky",
			status: TodoItemStatus.done,
		};
		const fakeUserId = 321;

		jest.spyOn(Logger, "error");
		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.resolve(fakeUserId)
		);
		jest.spyOn(newTodoItemValidator, "validateAsync").mockImplementation(
			(): Promise<Omit<INewTodoItem, "user_id">> => Promise.resolve(fakeValidatedValue)
		);
		jest.spyOn(TodoItemDA, "addNew").mockImplementation(
			(): Promise<void> => Promise.resolve()
		);

		const nextSpy: any = jest.fn();
		const resMock = ExpressTestHelpers.createResMock();
		const reqMock: IReqMock = { body: { anything: "yes" } };

		// -- Act
		await addTodoItem(reqMock as any, resMock, nextSpy);

		// -- Assert
		expect(Logger.error).not.toHaveBeenCalled();
		expect(newTodoItemValidator.validateAsync).toHaveBeenCalledWith(reqMock.body);
		expect(TodoItemDA.addNew).toHaveBeenCalledWith(
			{ ...fakeValidatedValue, user_id: fakeUserId }
		);
		expect(resMock.send).toHaveBeenCalledWith(
			getResponseValue(ResponseType.OK)
		);
		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalledWith(reqMock);
	});

	test("should catch data access error properly on", async () => {
		// -- Arrange
		const fakeValidatedValue: Omit<INewTodoItem, "user_id"> = {
			task: "tasky",
			status: TodoItemStatus.done,
		};
		const error = new Error("rejecty 2");
		const fakeUserId = 321;

		jest.spyOn(Logger, "error");
		jest.spyOn(newTodoItemValidator, "validateAsync").mockImplementation(
			(): Promise<Omit<INewTodoItem, "user_id">> => Promise.resolve(fakeValidatedValue)
		);
		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.resolve(fakeUserId)
		);
		jest.spyOn(TodoItemDA, "addNew").mockImplementation(
			(): Promise<void> => Promise.reject(error)
		);

		const nextSpy: any = jest.fn();
		const resMock = ExpressTestHelpers.createResMock();
		const reqMock: IReqMock = { body: { anything: "yes" } };

		// -- Act
		await addTodoItem(reqMock as any, resMock, nextSpy);

		// -- Assert
		expect(newTodoItemValidator.validateAsync).toHaveBeenCalledWith(reqMock.body);
		expect(TodoItemDA.addNew).toHaveBeenCalledWith(
			{ ...fakeValidatedValue, user_id: fakeUserId }
		);
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