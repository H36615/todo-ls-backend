
import { Logger } from "../../utils/logger/logger";
import { IUser_IdLess, userValidator } from "../../models/user/user";
import { getResponseValue, IController, ResponseType } from "../interfaces";
import { UserUtils } from "../../utils/user/user";

export const registerUser: IController = (req, res, next): Promise<void> => {

	// Validate param
	return userValidator.validateAsync(req.body).then((validatedValue: IUser_IdLess) =>

		UserUtils.createNewUser(validatedValue).then(() => {
			res.send(getResponseValue(ResponseType.UserCreated));
		})
	
		// TODO create session?
	).catch(error => {
		Logger.error("user controller: User creation failed.");
		next(error);
	});
};
