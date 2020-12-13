
import { Logger } from "../../utils/logger/logger";
import { INewUser, newUserValidator } from "../../models/user/user";
import { IController, ResponseType } from "../interfaces";
import { UserDA, userFoundByEmailErrorText } from "../../data-access/user/user";

export const registerUser: IController = (req, res, next): Promise<void> => {

	// Validate params
	return newUserValidator.validateAsync(req.body)
		.catch(error => {
			const unprocessableEntity = 422;
			res.status(unprocessableEntity);
			return Promise.reject(error);
		})
		.then((validatedValue: INewUser) => {
			return UserDA.createNewUser(validatedValue).then(() => {
				res.json(ResponseType.UserCreated);
			});
		}
		)
		.catch(error => {
			Logger.error(error);
			const conflictCode = 409;
			if (error === userFoundByEmailErrorText) {
				res.status(conflictCode);
				next(userFoundByEmailErrorText);
			}
			if (res.statusCode !== 500)
				next(error);
			next("Other error");
		});
};
