
import { Logger } from "../../utils/logger/logger";
import { IExistingUser, INewUser, newUserValidator } from "../../models/user/user";
import { IController, ResponseType } from "../interfaces";
import { UserDA, userFoundByEmailErrorText } from "../../data-access/user/user";
import { AuthUtils } from "../../utils/auth/auth";

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
		})
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

/** Respond w/ user info if session is valid, otherwise false as unauthorized. */
export const sessionIsValid: IController = (req, res, next): Promise<void> => {
	return Promise.resolve(AuthUtils.isAuthenticated(req))
		.then(isAuthenticated => {
			if (isAuthenticated)
				res.json(AuthUtils.stripUserInfo(req.user as IExistingUser));
			else {
				const unauthorized = 401;
				res.status(unauthorized).json(false);
			}
		})
		.catch(error => {
			Logger.error(error);
			next("Session authentication check failed");
		});
};