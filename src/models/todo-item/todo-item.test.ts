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
			.filter(key =>
				key !== todoItemDBModel.columns.id
				// User id can also be omitted, since that value is set from session.
				&& key !== todoItemDBModel.columns.user_id);
		const validatorKeys = Object.keys(newTodoItemValidator.describe().keys);

		// Act
		expect(interfaceKeys).toEqual(validatorKeys);
	});

	describe("validator", () => {
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
			test("item (w/ task: " + item.task + ") should be rejected properly", () => {
				return newTodoItemValidator.validateAsync(item)
					.then(validatedValue => {
						expect(validatedValue).toEqual(item);
					});
			});
		});
		invalidItems.forEach((item: Omit<INewTodoItem, "user_id">) => {
			test("item (w/ task: " + item.task + ") should be rejected properly", () => {
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