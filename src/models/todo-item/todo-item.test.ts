/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidationError } from "joi";
import {
	INewTodoItem, todoItemDBModel, TodoItemStatus, newTodoItemValidator
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
			.filter(key => key !== todoItemDBModel.columns.id);
		const validatorKeys = Object.keys(newTodoItemValidator.describe().keys);

		// Act
		expect(interfaceKeys).toEqual(validatorKeys);
	});

	describe("validator", () => {
		// -- Arrange
		const validItems: Array<INewTodoItem> = [
			{
				user_id: 1,
				task: "a",
				status: TodoItemStatus.done,
			},
			{
				user_id: Number.MAX_SAFE_INTEGER,
				task: "a",
				status: TodoItemStatus.done,
			},
			{
				user_id: 1,
				task: Array(100).join("x"),
				status: TodoItemStatus.done,
			},

			// task
			{
				user_id: 2,
				task: "a",
				status: TodoItemStatus.delayed,
			},
			{
				user_id: 3,
				task: "a",
				status: TodoItemStatus.done,
			},
			{
				user_id: 4,
				task: "a",
				status: TodoItemStatus.inProgres,
			},
			{
				user_id: 5,
				task: "a",
				status: TodoItemStatus.todo,
			},
		];
		const invalidItems: Array<INewTodoItem> = [
			// user id
			{
				user_id: -1,
				task: "a",
				status: TodoItemStatus.done,
			},
			{
				user_id: Number.MAX_SAFE_INTEGER + 1,
				task: "a",
				status: TodoItemStatus.done,
			},
			{
				task: "a",
				status: TodoItemStatus.done,
			} as INewTodoItem,

			// task
			{
				user_id: 1,
				task: "",
				status: TodoItemStatus.done,
			},
			{
				user_id: 2,
				// 102 actually gives 101 ?
				task: Array(102).join("x"),
				status: TodoItemStatus.done,
			},
			{
				user_id: 3,
				status: TodoItemStatus.done,
			} as INewTodoItem,

			// status
			{
				user_id: 4,
				task: "a",
			} as INewTodoItem,
			{
				user_id: 5,
				task: "a",
				status: "definitelynotvalidstatus",
			} as any,
		];

		// -- Act & Assert
		validItems.forEach((item: INewTodoItem) => {
			test("item (w/ id: " + item.user_id + ") should be rejected properly", () => {
				return newTodoItemValidator.validateAsync(item)
					.then(validatedValue => {
						expect(validatedValue).toEqual(item);
					});
			});
		});
		invalidItems.forEach((item: INewTodoItem) => {
			test("item (w/ id: " + item.user_id + ") should be rejected properly", () => {
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