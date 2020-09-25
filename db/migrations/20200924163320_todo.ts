
// Base created with 'npx knex migrate:make <table name>'

import * as Knex from "knex";

const todoItemTable = "todo_item";


export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(todoItemTable, tbl => {
		tbl.increments();
		tbl.text("task").notNullable();
		tbl.enum("state", ["todo", "in-progress", "done"]).notNullable();
	});
}


export async function down(knex: Knex): Promise<void> {
	knex.schema.dropTableIfExists(todoItemTable);
}

