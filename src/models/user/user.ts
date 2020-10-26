import { IDatabaseModel } from "../interfaces";
import Joi from "joi";

interface IUser extends IUser_IdLess {
	id: number,
}

interface IUser_IdLess {
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

const userValidator = Joi.object(
	{
		username: Joi.string().min(1).max(32).required(),
		tag: Joi.number().min(0).max(Number.MAX_VALUE).required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required(),
	}
);

export {
	IUser,
	IUser_IdLess,
	userDBModel,
	userValidator
};