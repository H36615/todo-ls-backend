import { ExpressTestHelpers, IReqMock } from "../../../testing/express-mocks";
import { Logger } from "../../utils/logger/logger";
import {
	ITodoItem, TodoItemStatus, newTodoItemValidator, INewTodoItem, todoItemValidator,
	idValidatorObject
} from "../../models/todo-item/todo-item";
import { ResponseType } from "../interfaces";
import { addTodoItem, deleteTodoItem, getAllTodoItems, updateTodoItem } from "./todo-item";
import { AuthUtils } from "../../utils/auth/auth";
import { TodoItemDA } from "../../data-access/todo-item/todo-item";
/* eslint-disable @typescript-eslint/no-explicit-any */

jest.mock("../../models/todo-item/todo-item");

describe("getAllTodoItems", () => {

	const fakeUserId = 11;
	const errorMessage = "faily";
	const reqMock: IReqMock = { body: { anything: "yes" } };
	const resMock = ExpressTestHelpers.createResMock();
	const nextSpy: any = jest.fn();
	const responseMock: ITodoItem[] = [
		{
			id: 22,
			status: TodoItemStatus.inProgres,
			task: "do a thing",
			user_id: 2222,
		},
		{
			id: 33,
			status: TodoItemStatus.delayed,
			task: "make that",
			user_id: 3333,
		}
	];
	const filteredResponseMock = responseMock.map(
		(row: ITodoItem) => {
			const mapItem: Omit<ITodoItem, "user_id"> = {
				task: row.task,
				status: row.status,
				id: row.id,
			};
			return mapItem;
		}
	);

	test("should respond w/ correct value(s)", async () => {
		// -- Arrange
		jest.spyOn(Logger, "error");
		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.resolve(fakeUserId)
		);
		jest.spyOn(TodoItemDA, "getAllMapped").mockImplementation(
			(): Promise<Omit<ITodoItem, "user_id">[]> =>
				Promise.resolve(filteredResponseMock)
		);

		// -- Act
		await getAllTodoItems(reqMock as any, resMock, nextSpy);

		// -- Assert
		expect(Logger.error).not.toHaveBeenCalled();
		expect(resMock.send).toHaveBeenCalledWith(filteredResponseMock);
		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalledWith(reqMock);
	});

	test("should catch auth error properly", async () => {

		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.reject(errorMessage)
		);
		jest.spyOn(TodoItemDA, "getAllMapped").mockImplementation(
			(): Promise<Omit<ITodoItem, "user_id">[]> =>
				Promise.resolve(filteredResponseMock)
		);
		jest.spyOn(Logger, "error");

		await getAllTodoItems(reqMock as any, resMock, nextSpy);

		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalledWith(reqMock);
		expect(TodoItemDA.getAllMapped).not.toHaveBeenCalled();
		expect(Logger.error).toHaveBeenCalledWith(errorMessage);
		expect(nextSpy).toHaveBeenCalledWith(errorMessage);
	});

	test("should catch data access error properly", async () => {

		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.resolve(fakeUserId)
		);
		jest.spyOn(TodoItemDA, "getAllMapped").mockImplementation(
			(): Promise<Omit<ITodoItem, "user_id">[]> =>
				Promise.reject(errorMessage)
		);
		jest.spyOn(Logger, "error");

		await getAllTodoItems(reqMock as any, resMock, nextSpy);

		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalledWith(reqMock);
		expect(TodoItemDA.getAllMapped).toHaveBeenCalledWith(fakeUserId);
		expect(Logger.error).toHaveBeenCalledWith(errorMessage);
		expect(nextSpy).toHaveBeenCalledWith(errorMessage);
	});
});

describe("addTodoItem", () => {

	const fakeValidatedValue: Omit<INewTodoItem, "user_id"> = {
		task: "tasky",
		status: TodoItemStatus.done,
	};
	const errorMessage = "faily";
	const fakeUserId = 11;

	test("should add properly", async () => {
		// -- Arrange
		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.resolve(fakeUserId)
		);
		jest.spyOn(newTodoItemValidator, "validateAsync").mockImplementation(
			(): Promise<Omit<INewTodoItem, "user_id">> => Promise.resolve(fakeValidatedValue)
		);
		jest.spyOn(TodoItemDA, "addNew").mockImplementation(
			(): Promise<void> => Promise.resolve()
		);
		jest.spyOn(Logger, "error");

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
		expect(resMock.send).toHaveBeenCalledWith(ResponseType.OK);
		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalledWith(reqMock);
	});

	test("should catch auth error properly", async () => {
		// -- Arrange
		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.reject(errorMessage)
		);
		jest.spyOn(newTodoItemValidator, "validateAsync").mockImplementation(
			(): Promise<Omit<INewTodoItem, "user_id">> => Promise.reject(fakeValidatedValue)
		);
		jest.spyOn(TodoItemDA, "addNew").mockImplementation(
			(): Promise<void> => Promise.resolve()
		);
		jest.spyOn(Logger, "error");

		const nextSpy: any = jest.fn();
		const resMock = ExpressTestHelpers.createResMock();
		const reqMock: IReqMock = { body: { anything: "yes" } };

		// -- Act
		await addTodoItem(reqMock as any, resMock, nextSpy);

		// -- Assert
		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalledWith(reqMock);
		expect(newTodoItemValidator.validateAsync).not.toHaveBeenCalled();
		expect(TodoItemDA.addNew).not.toHaveBeenCalled();
		expect(resMock.send).not.toHaveBeenCalled();
		expect(Logger.error).toHaveBeenCalledWith(errorMessage);
		expect(nextSpy).toHaveBeenCalledWith(errorMessage);
	});

	test("should catch validation error properly", async () => {
		// -- Arrange

		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.resolve(fakeUserId)
		);
		jest.spyOn(newTodoItemValidator, "validateAsync").mockImplementation(
			(): Promise<Omit<INewTodoItem, "user_id">> => Promise.reject(errorMessage)
		);
		jest.spyOn(TodoItemDA, "addNew").mockImplementation(
			(): Promise<void> => Promise.resolve()
		);
		jest.spyOn(Logger, "error");

		const nextSpy: any = jest.fn();
		const resMock = ExpressTestHelpers.createResMock();
		const reqMock: IReqMock = { body: { anything: "yes" } };

		// -- Act
		await addTodoItem(reqMock as any, resMock, nextSpy);

		// -- Assert
		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalledWith(reqMock);
		expect(newTodoItemValidator.validateAsync).toHaveBeenCalledWith(reqMock.body);
		expect(TodoItemDA.addNew).not.toHaveBeenCalled();
		expect(resMock.send).not.toHaveBeenCalled();
		expect(Logger.error).toHaveBeenCalledWith(errorMessage);
		expect(nextSpy).toHaveBeenCalledWith(errorMessage);
	});

	test("should catch data access error properly", async () => {
		// -- Arrange

		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.resolve(fakeUserId)
		);
		jest.spyOn(newTodoItemValidator, "validateAsync").mockImplementation(
			(): Promise<Omit<INewTodoItem, "user_id">> => Promise.resolve(fakeValidatedValue)
		);
		jest.spyOn(TodoItemDA, "addNew").mockImplementation(
			(): Promise<void> => Promise.reject(errorMessage)
		);
		jest.spyOn(Logger, "error");

		const nextSpy: any = jest.fn();
		const resMock = ExpressTestHelpers.createResMock();
		const reqMock: IReqMock = { body: { anything: "yes" } };

		// -- Act
		await addTodoItem(reqMock as any, resMock, nextSpy);

		// -- Assert
		expect(newTodoItemValidator.validateAsync).toHaveBeenCalledWith(reqMock.body);
		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalledWith(reqMock);
		expect(TodoItemDA.addNew).toHaveBeenCalledWith(
			{ ...fakeValidatedValue, user_id: fakeUserId }
		);
		expect(nextSpy).toHaveBeenCalledWith(errorMessage);
		expect(resMock.send).not.toHaveBeenCalled();
		expect(Logger.error).toHaveBeenCalledWith(errorMessage);
	});
});

describe("updateTodoItem", () => {

	const fakeUserId = 1;
	const fakeValidatedValue: ITodoItem = {
		id: 2,
		user_id: 22,
		task: "tasky",
		status: TodoItemStatus.done,
	};
	const errorMessage = "faily";

	test("should update properly", async () => {
		// -- Arrange
		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.resolve(fakeUserId)
		);
		jest.spyOn(todoItemValidator, "validateAsync").mockImplementation(
			(): Promise<ITodoItem> => Promise.resolve(fakeValidatedValue)
		);
		jest.spyOn(TodoItemDA, "update").mockImplementation(
			(): Promise<void> => Promise.resolve()
		);
		jest.spyOn(Logger, "error");

		const nextSpy: any = jest.fn();
		const resMock = ExpressTestHelpers.createResMock();
		const reqMock: IReqMock = { body: { anything: "yup" } };

		// -- Act
		await updateTodoItem(reqMock as any, resMock, nextSpy);

		// -- Assert
		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalledWith(reqMock);
		expect(todoItemValidator.validateAsync)
			.toHaveBeenCalledWith({ ...reqMock.body, user_id: fakeUserId });
		expect(TodoItemDA.update)
			.toHaveBeenCalledWith(fakeValidatedValue);
		expect(resMock.json).toHaveBeenCalledWith(ResponseType.OK);
		expect(Logger.error).not.toHaveBeenCalled();
	});

	test("should catch auth error properly", async () => {
		// -- Arrange
		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.reject(errorMessage)
		);
		jest.spyOn(todoItemValidator, "validateAsync").mockImplementation(
			(): Promise<ITodoItem> => Promise.resolve(fakeValidatedValue)
		);
		jest.spyOn(TodoItemDA, "update").mockImplementation(
			(): Promise<void> => Promise.resolve()
		);
		jest.spyOn(Logger, "error");

		const nextSpy: any = jest.fn();
		const resMock = ExpressTestHelpers.createResMock();
		const reqMock: IReqMock = { body: { anything: "yes" } };

		// -- Act
		await updateTodoItem(reqMock as any, resMock, nextSpy);

		// -- Assert
		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalledWith(reqMock);
		expect(todoItemValidator.validateAsync).not.toHaveBeenCalled();
		expect(TodoItemDA.update).not.toHaveBeenCalled();
		expect(resMock.json).not.toHaveBeenCalled();
		expect(Logger.error).toHaveBeenCalledWith(errorMessage);
		expect(nextSpy).toHaveBeenCalledWith(new Error("Updating item failed"));
	});

	test("should catch validation error properly", async () => {
		// -- Arrange
		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.resolve(fakeUserId)
		);
		jest.spyOn(todoItemValidator, "validateAsync").mockImplementation(
			(): Promise<ITodoItem> => Promise.reject(errorMessage)
		);
		jest.spyOn(TodoItemDA, "update").mockImplementation(
			(): Promise<void> => Promise.resolve()
		);
		jest.spyOn(Logger, "error");

		const nextSpy: any = jest.fn();
		const resMock = ExpressTestHelpers.createResMock();
		const reqMock: IReqMock = { body: { anything: "yes" } };

		// -- Act
		await updateTodoItem(reqMock as any, resMock, nextSpy);

		// -- Assert
		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalledWith(reqMock);
		expect(todoItemValidator.validateAsync)
			.toHaveBeenCalledWith({ ...reqMock.body, user_id: fakeUserId });
		expect(TodoItemDA.update).not.toHaveBeenCalled();
		expect(resMock.json).not.toHaveBeenCalled();
		expect(Logger.error).toHaveBeenCalledWith(errorMessage);
		expect(nextSpy).toHaveBeenCalledWith(new Error("Updating item failed"));
	});

	test("should catch data access error properly", async () => {
		// -- Arrange
		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.resolve(fakeUserId)
		);
		jest.spyOn(todoItemValidator, "validateAsync").mockImplementation(
			(): Promise<Omit<INewTodoItem, "user_id">> => Promise.resolve(fakeValidatedValue)
		);
		jest.spyOn(TodoItemDA, "update").mockImplementation(
			(): Promise<void> => Promise.reject(errorMessage)
		);
		jest.spyOn(Logger, "error");

		const nextSpy: any = jest.fn();
		const resMock = ExpressTestHelpers.createResMock();
		const reqMock: IReqMock = { body: { anything: "yes22" } };

		// -- Act
		await updateTodoItem(reqMock as any, resMock, nextSpy);

		// -- Assert
		expect(todoItemValidator.validateAsync)
			.toHaveBeenCalledWith({ ...reqMock.body, user_id: fakeUserId });
		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalledWith(reqMock);
		expect(TodoItemDA.update).toHaveBeenCalledWith(fakeValidatedValue);
		expect(resMock.json).not.toHaveBeenCalled();
		expect(Logger.error).toHaveBeenCalledWith(errorMessage);
		expect(nextSpy).toHaveBeenCalledWith(new Error("Updating item failed"));
	});
});

describe("deleteTodoItem", () => {

	const fakeUserId = 1;
	const fakeValidatedValue: Pick<ITodoItem, "id"> = {
		id: 2,
	};
	const errorMessage = "faily";

	test("should delete properly", async () => {
		// -- Arrange
		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.resolve(fakeUserId)
		);
		jest.spyOn(idValidatorObject, "validateAsync").mockImplementation(
			(): Promise<Pick<ITodoItem, "id">> => Promise.resolve(fakeValidatedValue)
		);
		jest.spyOn(TodoItemDA, "delete").mockImplementation(
			(): Promise<void> => Promise.resolve()
		);
		jest.spyOn(Logger, "error");

		const nextSpy: any = jest.fn();
		const resMock = ExpressTestHelpers.createResMock();
		const reqMock: IReqMock = { body: { anything: "asdff" } };

		// -- Act
		await deleteTodoItem(reqMock as any, resMock, nextSpy);

		// -- Assert
		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalledWith(reqMock);
		expect(idValidatorObject.validateAsync).toHaveBeenCalledWith(reqMock.body);
		expect(TodoItemDA.delete)
			.toHaveBeenCalledWith({ ...fakeValidatedValue, user_id: fakeUserId });
		expect(resMock.json).toHaveBeenCalledWith(ResponseType.OK);
		expect(Logger.error).not.toHaveBeenCalled();
	});

	test("should catch auth error properly", async () => {
		// -- Arrange
		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.reject(errorMessage)
		);
		jest.spyOn(idValidatorObject, "validateAsync").mockImplementation(
			(): Promise<Pick<ITodoItem, "id">> => Promise.resolve(fakeValidatedValue)
		);
		jest.spyOn(TodoItemDA, "delete").mockImplementation(
			(): Promise<void> => Promise.resolve()
		);
		jest.spyOn(Logger, "error");

		const nextSpy: any = jest.fn();
		const resMock = ExpressTestHelpers.createResMock();
		const reqMock: IReqMock = { body: { anything: "ddsfdsf" } };

		// -- Act
		await deleteTodoItem(reqMock as any, resMock, nextSpy);

		// -- Assert
		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalledWith(reqMock);
		expect(idValidatorObject.validateAsync).not.toHaveBeenCalled();
		expect(TodoItemDA.delete).not.toHaveBeenCalled();
		expect(resMock.json).not.toHaveBeenCalledWith(ResponseType.OK);
		expect(Logger.error).toHaveBeenCalledWith(errorMessage);
		expect(nextSpy).toHaveBeenCalledWith("Deleting item failed");
	});

	test("should catch validation error properly", async () => {
		// -- Arrange
		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.resolve(fakeUserId)
		);
		jest.spyOn(idValidatorObject, "validateAsync").mockImplementation(
			(): Promise<Pick<ITodoItem, "id">> => Promise.reject(errorMessage)
		);
		jest.spyOn(TodoItemDA, "delete").mockImplementation(
			(): Promise<void> => Promise.resolve()
		);
		jest.spyOn(Logger, "error");

		const nextSpy: any = jest.fn();
		const resMock = ExpressTestHelpers.createResMock();
		const reqMock: IReqMock = { body: { anything: "ddsfdsf" } };

		// -- Act
		await deleteTodoItem(reqMock as any, resMock, nextSpy);

		// -- Assert
		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalledWith(reqMock);
		expect(idValidatorObject.validateAsync).toHaveBeenCalledWith(reqMock.body);
		expect(TodoItemDA.delete).not.toHaveBeenCalled();
		expect(resMock.json).not.toHaveBeenCalled();
		expect(Logger.error).toHaveBeenCalledWith(errorMessage);
		expect(nextSpy).toHaveBeenCalledWith("Deleting item failed");
	});

	test("should catch validation error properly", async () => {
		// -- Arrange
		jest.spyOn(AuthUtils, "getUserIdFromSession").mockImplementation(
			(): Promise<number> => Promise.resolve(fakeUserId)
		);
		jest.spyOn(idValidatorObject, "validateAsync").mockImplementation(
			(): Promise<Pick<ITodoItem, "id">> => Promise.resolve(fakeValidatedValue)
		);
		jest.spyOn(TodoItemDA, "delete").mockImplementation(
			(): Promise<void> => Promise.reject(errorMessage)
		);
		jest.spyOn(Logger, "error");

		const nextSpy: any = jest.fn();
		const resMock = ExpressTestHelpers.createResMock();
		const reqMock: IReqMock = { body: { anything: "ddsfdsf" } };

		// -- Act
		await deleteTodoItem(reqMock as any, resMock, nextSpy);

		// -- Assert
		expect(AuthUtils.getUserIdFromSession).toHaveBeenCalledWith(reqMock);
		expect(idValidatorObject.validateAsync).toHaveBeenCalledWith(reqMock.body);
		expect(TodoItemDA.delete)
			.toHaveBeenCalledWith({ ...fakeValidatedValue, user_id: fakeUserId });
		expect(resMock.json).not.toHaveBeenCalled();
		expect(Logger.error).toHaveBeenCalledWith(errorMessage);
		expect(nextSpy).toHaveBeenCalledWith("Deleting item failed");
	});
});