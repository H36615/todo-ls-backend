// Generated with 'npx knex seed:make <table-name>>'.

import * as Knex from "knex";
import { IUser, userDBModel } from "../../src/models/user/user-item";

const userData1Id = 0;

export async function seed(knex: Knex): Promise<void> {
	// Deletes ALL existing entries
	await knex(userDBModel.table).del();
    
	// -- Inserts seed entries

	const userData1: IUser = {
		id: userData1Id,
		username: "Testman99",
		tag: 0,
		email: "testman@domain.net",
		password: "testman",
	};
	const userData2: IUser = {
		id: 1,
		username: "DevguY",
		tag: 0,
		email: "devguy@domain.net",
		password: "devguy",
	};

	await knex(userDBModel.table).insert([
		userData1,
		userData2,
	]);
}

export { userData1Id };