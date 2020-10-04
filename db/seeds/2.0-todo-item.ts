// import * as Knex from "knex";

import Knex from "knex";
import { ITodoItem, todoItemDBModel, TodoItemStatus } from "../../src/models/todo-item/todo-item";
import { userData1Id } from "./1.0-user";

export async function seed(knex: Knex): Promise<void> {
	// -- Deletes ALL existing entries
	
	await knex(todoItemDBModel.table).del();
	// TODO delete user table.
	

	// -- Inserts seed entries

	const todoItemTableData1: ITodoItem = {
		id: 0,
		user_id: userData1Id,
		task: "get up from bed",
		status: TodoItemStatus.todo,
	};
	const todoItemTableData2: ITodoItem = {
		id: 1,
		user_id: userData1Id,
		task: "drink water",
		status: TodoItemStatus.done,
	};
	await knex(todoItemDBModel.table).insert([
		todoItemTableData1,
		todoItemTableData2,
	]);
}
