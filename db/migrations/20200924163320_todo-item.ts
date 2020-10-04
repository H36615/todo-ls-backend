
// Base created with 'npx knex migrate:make <table name>'

import * as Knex from "knex";
import { todoItemDBModel, TodoItemStatus } from "../../src/models/todo-item/todo-item";
import { userDBModel } from "../../src/models/user/user-item";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(todoItemDBModel.table, table => {
		table.increments(todoItemDBModel.columns.id).primary();
		table.integer(todoItemDBModel.columns.user_id)
			.notNullable().references(userDBModel.columns.id).inTable(userDBModel.table);
		table.text(todoItemDBModel.columns.task).notNullable();
		table.enum(
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

