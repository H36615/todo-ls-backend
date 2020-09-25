
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+"/.env" });

// Created with knex init command.

export default {
	development: {
		client: "pg",
		connection: {
			host: process.env.DATABASE_HOST,
			port: process.env.DATABASE_PORT,
			database: process.env.DATABASE_NAME,
			user: process.env.DATABASE_USER_NAME,
			password: process.env.DATABASE_USER_PASSWORD
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: { directory: "./db/migrations" },
		seeds: { directory: "./db/seeds" },
	},

	// production: {
	// 	client: "postgresql",
	// 	connection: {
	// 		database: "my_db",
	// 		user: "username",
	// 		password: "password"
	// 	},
	// 	pool: {
	// 		min: 2,
	// 		max: 10
	// 	},
	// 	migrations: {
	// 		directory: "./db/migrations",
	// 	},
	// 	seeds: { directory: "./db/seeds" },
	// }

};

