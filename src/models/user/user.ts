import { IDatabaseModel } from "../interfaces";
import Joi from "joi";

interface IExistingUser extends INewUser {
	id: number,
	tag: number, // Number value to seperate users w/ identical usernames.
}

/** User interface w/ some fields excluded not needed in new user context. */
interface INewUser extends ILoginInformation {
	username: string,
}

interface ILoginInformation {
	email: string,
	password: string,
}

const userDBModel: IDatabaseModel<IExistingUser> = {
	table: "user",
	columns: {
		id: "id",
		username: "username",
		tag: "tag",
		email: "email",
		password: "password",
	},
};

// Uncomment if needed.
// const tagValidator = Joi.number().min(0).max(Number.MAX_VALUE).required();
const emailValidator = Joi.string().email().required();
const passwordValidator = Joi.string().min(6).max(512).required();
const newUserValidator = Joi.object(
	{
		username: Joi.string().alphanum().min(1).max(32).required(),
		email: emailValidator,
		password: passwordValidator,
	}
);
const loginInformationValidator = Joi.object(
	{
		email: emailValidator,
		password: passwordValidator,
	}
);

export {
	IExistingUser,
	INewUser,
	ILoginInformation,
	userDBModel,
	newUserValidator,
	loginInformationValidator,
};