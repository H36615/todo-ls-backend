// import * as Knex from "knex";

import Knex from "knex";
import { todoItemDBModel, TodoItemStatus } from "../../src/models/todo-item/todo-item";
import { userData1Id } from "./1.0-user";

export async function seed(knex: Knex): Promise<void> {
	// -- Deletes ALL existing entries
	
	await knex(todoItemDBModel.table).del();
	// TODO delete user table.
	

	// -- Inserts seed entries

	// Note: Knex requires that object keys are named
	// same way as in db (e.g. user_id), so we lose type-checking. Thanks, Knex!
	// Let's then hope that unit tests will be kept up to date.
	const todoItemTableData1 = {
		id: 0,
		user_id: userData1Id,
		task: "get up from bed",
		status: TodoItemStatus.todo,
	};
	const todoItemTableData2 = {
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
