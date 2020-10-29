

import { dBConfig } from "../../config/db-config";
import { Logger } from "../../services/logger/logger";
import { IUser_IdLess, userDBModel, userValidator } from "../../models/user/user";
import { getResponseValue, IController, ResponseType } from "../interfaces";

export const registerUser: IController = (req, res, next): Promise<void> => {

	// Validate param
	return userValidator.validateAsync(req.body).then((validatedValue: IUser_IdLess) =>

		registerNewUser(validatedValue).then(() => {
			res.send(getResponseValue(ResponseType.OK));
		})

	).catch(error => {
		Logger.error(error);
		next(error);
	});
};

function registerNewUser(newUser: IUser_IdLess): Promise<void> {

	// TODO implement
	throw new Error("Not implemented");

	return dBConfig(userDBModel.table)
		.insert(newUser);
}
