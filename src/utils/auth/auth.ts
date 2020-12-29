import {
	ILoginInformation, IExistingUser, loginInformationValidator, userDBModel
} from "../../models/user/user";
import { dBConfig } from "../../config/db-config";
import { Logger } from "../logger/logger";
import { compare } from "bcrypt";
import { NextFunction, Request, Response } from "express";

export class AuthUtils {

	/**
	 * Whether user is authenticated with given login info.
	 * If success, return authenticated user's selected properties.
	 */
	public static isAuthenticatedWithLoginInfo(user: ILoginInformation)
		: Promise<Pick<IExistingUser, "username" | "tag" | "id">> {

		let foundUser: IExistingUser;

		return loginInformationValidator.validateAsync(user)
			.then((validatedUser: ILoginInformation) => {

				const onlyEmailIncluded: Pick<ILoginInformation, "email">
					= { email: validatedUser.email };

				return dBConfig(userDBModel.table)
					.where(onlyEmailIncluded);
			})
			.then((usersFound: Array<IExistingUser>) => {

				if (usersFound.length < 1)
					return Promise.reject(
						"error: No users found during authentication."
					);

				if (usersFound.length > 1)
					return Promise.reject(
						"error: More than 1 users found during authentication."
					);

				foundUser = usersFound[0];

				return compare(user.password, usersFound[0].password);
			})
			.then((hashesMatch: boolean) => {

				if (foundUser.id < 0)
					return Promise.reject("error: User id not set.");

				// All OK.
				if (hashesMatch)
					return Promise.resolve(this.stripUserInfo(foundUser));

				return Promise.reject("error: Hash did not match.");
			});
	}

	/**
	 * Strip info from user leaving only the fields that are safe to
	 * send back to client.
	 */
	public static stripUserInfo(user: IExistingUser)
		: Pick<IExistingUser, "username" | "tag" | "id"> {
		return {
			username: user.username,
			tag: user.tag,
			id: user.id,
		};
	}

	/** AKA is logged in. */
	public static sessionIsAuthenticated(req: Request, res: Response, next: NextFunction): void {
		// passport.js makes sure this function is in 'req'.
		// Value comes from sent, deserialized ('passportConfig.deserializeUser') cookie.
		if (this.isAuthenticated(req))
			next();
		else
			next(new Error("User authentication failed"));
	}

	public static isAuthenticated(req: Request): boolean {
		return req.isAuthenticated();
	}

	public static getUserIdFromSession(req: Request): Promise<number> {
		const userId = (req.user as IExistingUser)?.id;
		if (userId == undefined) {
			Logger.error("user id not found from the session for id: " + userId);
			return Promise.reject("Session authentication error");
		}

		return Promise.resolve(userId);
	}
}
