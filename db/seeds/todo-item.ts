// import * as Knex from "knex";

import Knex from "knex";
import { ITodoItem, todoItemDBModel, TodoItemStatus } from "../../src/models/todo-item/todo-item";

export async function seed(knex: Knex): Promise<void> {
	// -- Deletes ALL existing entries
	
	await knex(todoItemDBModel.table).del();

	

	// -- Inserts seed entries

	const todoItemTableData1: ITodoItem = {
		task: "tester task 1",
		status: TodoItemStatus.todo,
	};
	const todoItemTableData2: ITodoItem = {
		task: "tester task 2",
		status: TodoItemStatus.done,
	};
	await knex(todoItemDBModel.table).insert([
		todoItemTableData1,
		todoItemTableData2,
	]);
}
