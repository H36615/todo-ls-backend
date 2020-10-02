import { IDatabaseModel } from "../interfaces";

interface IUser {
	id: number,
	username: string,
	tag: number, // Number value to seperate users w/ identical usernames.
	email: string,
    password: string,
}

const userDBModel: IDatabaseModel<IUser> = {
	table: "user",
	columns: {
		id: "id",
		username: "username",
		tag: "tag",
		email: "email",
		password: "password",
	},
};

export {
	IUser,
	userDBModel
};