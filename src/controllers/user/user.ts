
import { Logger } from "../../utils/logger/logger";
import { INewUser, newUserValidator } from "../../models/user/user";
import { IController, ResponseType } from "../interfaces";
import { UserDA } from "../../data-access/user/user";

export const registerUser: IController = (req, res, next): Promise<void> => {

	// Validate param
	return newUserValidator.validateAsync(req.body).then((validatedValue: INewUser) =>

		UserDA.createNewUser(validatedValue).then(() => {
			res.send(ResponseType.UserCreated);
		})
		
	).catch(error => {
		Logger.error("user controller: User creation failed.");
		next(error);
	});
};
