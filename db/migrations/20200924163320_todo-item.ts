
// Base created with 'npx knex migrate:make <table name>'

import * as Knex from "knex";
import { todoItemDBModel, TodoItemStatus } from "../../src/models/todo-item/todo-item";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(todoItemDBModel.table, tbl => {
		tbl.increments();
		tbl.text(todoItemDBModel.columns.task).notNullable();
		tbl.enum(
			todoItemDBModel.columns.status,
			Object.values(TodoItemStatus),
			{ useNative: true, enumName: todoItemDBModel.columns.status }
		).notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	knex.schema.dropTableIfExists(todoItemDBModel.table);

	// TODO enum types seem not to be affected?
}

