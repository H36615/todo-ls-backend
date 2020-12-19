/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidationError } from "joi";
import {
	INewTodoItem, todoItemDBModel, TodoItemStatus, newTodoItemValidator,
	todoItemValidator, ITodoItem
} from "./todo-item";

test("test that columns' key name and value match", () => {
	// Arrange
	const columnNames = Object.keys(todoItemDBModel.columns);
	const columnValues = Object.values(todoItemDBModel.columns);

	// Act + Assert
	for (let i = 0; i < columnNames.length; i++) {
		// We want to make sure db namings match interface properties.
		expect(columnNames[i]).toEqual(columnValues[i]);
	}
});

describe("newTodoItemValidator", () => {
	test("test that interface and validator have matching properties", () => {
		// Arrange
		const interfaceKeys = Object.values(todoItemDBModel.columns)
			.filter(key =>
				key !== todoItemDBModel.columns.id
				// User id can also be omitted, since that value is set from session.
				&& key !== todoItemDBModel.columns.user_id);
		const validatorKeys = Object.keys(newTodoItemValidator.describe().keys);

		// Act
		expect(interfaceKeys).toEqual(validatorKeys);
	});

	describe("validation", () => {
		// -- Arrange
		const validItems: Array<Omit<INewTodoItem, "user_id">> = [
			{
				task: "a",
				status: TodoItemStatus.done,
			},
			{
				task: Array(100).join("x"),
				status: TodoItemStatus.done,
			},

			// task
			{
				task: "b",
				status: TodoItemStatus.delayed,
			},
			{
				task: "c",
				status: TodoItemStatus.done,
			},
			{
				task: "d",
				status: TodoItemStatus.inProgres,
			},
			{
				task: "e",
				status: TodoItemStatus.todo,
			},
		];
		const invalidItems: Array<Omit<INewTodoItem, "user_id">> = [
			// task
			{
				task: "",
				status: TodoItemStatus.done,
			},
			{
				// 102 actually gives 101 ?
				task: Array(102).join("x"),
				status: TodoItemStatus.done,
			},
			{
				status: TodoItemStatus.done,
			},

			// status
			{
				task: "a",
			},
			{
				task: "a",
				status: "definitelynotvalidstatus",
			} as any,
		];

		// -- Act & Assert
		validItems.forEach((item: Omit<INewTodoItem, "user_id">) => {
			test("item (w/ task: " + item.task + ") should pass validation", () => {
				return newTodoItemValidator.validateAsync(item)
					.then(validatedValue => {
						expect(validatedValue).toEqual(item);
					});
			});
		});
		invalidItems.forEach((item: Omit<INewTodoItem, "user_id">) => {
			test("item (w/ task: " + item.task + ") should be rejected", () => {
				return newTodoItemValidator.validateAsync(item)
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

describe("todoItemValidator", () => {
	test("test that interface and validator have matching properties", () => {
		// Arrange
		const interfaceKeys = Object.values(todoItemDBModel.columns);
		const validatorKeys = Object.keys(todoItemValidator.describe().keys);

		// Act
		expect(interfaceKeys).toEqual(validatorKeys);
	});

	describe("validation", () => {
		// -- Arrange
		const validItems: Array<ITodoItem> = [
			// Some general items which are extensively tested above.
			{
				user_id: 0,
				id: Number.MAX_SAFE_INTEGER,
				task: "a",
				status: TodoItemStatus.done,
			},
			{
				user_id: 0,
				id: 0,
				task: Array(100).join("x"),
				status: TodoItemStatus.inProgres,
			},

			// user_id
			{
				user_id: 100,
				id: 11,
				task: "b",
				status: TodoItemStatus.delayed,
			},

			// id
			{
				user_id: 1,
				id: 100,
				task: "c",
				status: TodoItemStatus.delayed,
			},
		];
		const invalidItems: Array<ITodoItem> = [
			// Some general items -||-
			{
				user_id: 0,
				id: 11,
				task: "",
				status: TodoItemStatus.done,
			},
			{
				user_id: 1,
				id: 11,
				task: Array(102).join("x"),
				status: TodoItemStatus.inProgres,
			},

			// user_id
			{
				user_id: -1,
				id: 11,
				task: "d",
				status: TodoItemStatus.delayed,
			},
			{
				user_id: Number.MAX_SAFE_INTEGER + 1,
				id: 11,
				task: "e",
				status: TodoItemStatus.delayed,
			},

			// id
			{
				user_id: 1,
				id: -1,
				task: "f",
				status: TodoItemStatus.delayed,
			},
			{
				user_id: 1,
				id: Number.MAX_SAFE_INTEGER + 1,
				task: "g",
				status: TodoItemStatus.delayed,
			},

			{
				task: "",
				status: TodoItemStatus.done,
			} as any,
		];

		// -- Act & Assert
		validItems.forEach((item: ITodoItem) => {
			test("item (w/ task: " + item.task + ") should pass validation", () => {
				return todoItemValidator.validateAsync(item)
					.then(validatedValue => {
						expect(validatedValue).toEqual(item);
					});
			});
		});
		invalidItems.forEach((item: ITodoItem) => {
			test("item (w/ task: " + item.task + ") should be rejected", () => {
				return todoItemValidator.validateAsync(item)
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