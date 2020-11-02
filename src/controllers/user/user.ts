
import { Logger } from "../../utils/logger/logger";
import { INewUser, newUserValidator } from "../../models/user/user";
import { getResponseValue, IController, ResponseType } from "../interfaces";
import { UserUtils } from "../../utils/user/user";

export const registerUser: IController = (req, res, next): Promise<void> => {

	// Validate param
	return newUserValidator.validateAsync(req.body).then((validatedValue: INewUser) =>

		UserUtils.createNewUser(validatedValue).then(() => {
			res.send(getResponseValue(ResponseType.UserCreated));
		})
	
		// TODO create session?
	).catch(error => {
		Logger.error("user controller: User creation failed.");
		next(error);
	});
};
