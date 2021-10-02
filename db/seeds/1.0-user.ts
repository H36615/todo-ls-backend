// Generated with 'npx knex seed:make <table-name>>'.
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../.env" });

import * as Knex from "knex";
import { userDBModel } from "../../src/models/user/user";
import { UserDA } from "../../src/data-access/user/user";

export async function seed(knex: Knex): Promise<void> {
	// -- Delete existing entries

	await knex(userDBModel.table).del();

	// -- Insert seed entries

	if (process.env.PUBLIC_TEST_USER_USERNAME
		&& process.env.PUBLIC_TEST_USER_EMAIL
		&& process.env.PUBLIC_TEST_USER_PASSWORD
	) await UserDA.createNewUser(
		{
			username: process.env.PUBLIC_TEST_USER_USERNAME,
			email: process.env.PUBLIC_TEST_USER_EMAIL,
			password: process.env.PUBLIC_TEST_USER_PASSWORD,
		}
	);
}

export const userData1Id = 0;