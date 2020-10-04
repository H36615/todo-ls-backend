/* eslint-disable @typescript-eslint/no-explicit-any */

import mockKnex from "mock-knex";
import dbConfig from "../../config/db-config";
import { ITodoItem, TodoItemStatus } from "../../models/todo-item/todo-item";
import { getAllTodoItems } from "./todo-item";

mockKnex.mock(dbConfig);

const tracker = mockKnex.getTracker();
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

test("getAllTodoItems should respond w/ correct value(s)", async (done) => {
	// Arrange
	tracker.install();
	tracker.on(
		"query",
		(query) => { query.response(responseMock); }
	);
	const mockRes: any = {
		send: jest.fn(),
	};

	// Act
	getAllTodoItems({} as any, mockRes).then(() => {

		// Assert
		expect(mockRes.send).toHaveBeenCalledWith(responseMock);

		done();
	});
});

tracker.uninstall();