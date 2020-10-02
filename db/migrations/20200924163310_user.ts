import * as Knex from "knex";
import { userDBModel } from "../../src/models/user/user-item";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(
		userDBModel.table,
		table => {
			table.increments(userDBModel.columns.id).primary();
			table.text(userDBModel.columns.username).notNullable();
			table.text(userDBModel.columns.tag).notNullable();
			table.text(userDBModel.columns.email).unique().notNullable();
			table.text(userDBModel.columns.password).notNullable();
		},
	);
}

export async function down(knex: Knex): Promise<void> {
	knex.schema.dropTableIfExists(userDBModel.table);
}

