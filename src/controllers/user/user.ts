
import { Logger } from "../../utils/logger/logger";
import { IUser_IdLess, userValidator } from "../../models/user/user";
import { getResponseValue, IController, ResponseType } from "../interfaces";
import { UserUtils } from "../../utils/user/user";

export const registerUser: IController = (req, res, next): Promise<void> => {

	// Validate param
	return userValidator.validateAsync(req.body).then((validatedValue: IUser_IdLess) =>

		UserUtils.createNewUser(validatedValue).then(() => {
			res.send(getResponseValue(ResponseType.OK));
		})

	).catch(error => {
		Logger.error(error);
		next(error);
	});
};
