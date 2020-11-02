import {
	ILoginInformation, INewUser, IExistingUser, loginInformationValidator, userDBModel
} from "../../models/user/user";
import { hash } from "bcrypt";
import { dBConfig } from "../../config/db-config";
import { Logger } from "../logger/logger";
import { compare } from "bcrypt";
import { NextFunction, Request, Response } from "express";

export class UserUtils {

	/**
	 * Get users from DB by given params.
	 */
	private static getUsersFromDB(username: string, tag?: number): Promise<IExistingUser[]> {
		if (tag != undefined) {
			const searchObject: Pick<IExistingUser, "username" | "tag">
				= { username: username, tag: tag };
			return dBConfig(userDBModel.table).where(searchObject);
		}
		else {
			const searchObject: Pick<INewUser, "username"> = { username: username };
			return dBConfig(userDBModel.table).where(searchObject);
		}
	}

	public static getUserFromDBByUserId(userId: number): Promise<IExistingUser> {
		return this.getUsersFromDBByUserId(userId).then((usersFound: Array<IExistingUser>) => {
			if (usersFound.length < 1)
				return Promise.reject(
					"no users found"
				);

			if (usersFound.length > 1)
				return Promise.reject(
					"more than 1 user found"
				);

			return usersFound[0];
		});
	}

	public static getUsersFromDBByUserId(userId: number): Promise<IExistingUser[]> {
		if (userId === undefined)
			return Promise.reject("user id undefined");

		const searchObject: Pick<IExistingUser, "id"> = { id: userId };
		return dBConfig(userDBModel.table).where(searchObject);
	}

	/**
	 * Create new user to DB... if everything is OK.
	 */
	public static createNewUser(_newUser: INewUser): Promise<number[]> {

		// We are gonna need to create tag before creating new user.
		const newUser: Omit<IExistingUser, "id"> = { ..._newUser, tag: 0 };

		// Deduce tag by checking existing users w/ same username.
		return this.getUsersFromDB(newUser.username)
			.then((foundUsers: Array<IExistingUser>) => {

				newUser.tag = foundUsers.length > 0
					? foundUsers[foundUsers.length - 1].tag + 1
					: 0;

				// Make sure user w/ same name and tag does not exist.
				return this.getUsersFromDB(newUser.username, newUser.tag);
			})
			.then((foundUsers: Array<IExistingUser>) => {
				if (foundUsers.length === 0)
					return hash(newUser.password, 10);

				return Promise.reject("User found with same tag");
			})
			.then(hashedPassword => {
				newUser.password = hashedPassword;

				return dBConfig(userDBModel.table)
					.insert(newUser);
			})
			.catch(error => {
				Logger.error(error);
				return Promise.reject(error);
			});
	}

	/**
	 * Whether user is authenticated with given login info.
	 * If success, return authenticated user id.
	 */
	public static isAuthenticatedWithLoginInfo(user: ILoginInformation): Promise<number> {

		let userId = -1;

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

				userId = usersFound[0].id;

				return compare(user.password, usersFound[0].password);
			})
			.then((hashesMatch: boolean) => {

				if (userId < 0)
					return Promise.reject("error: User id not set.");

				// All OK.
				if (hashesMatch)
					return Promise.resolve(userId);

				return Promise.reject("error: Hash did not match.");
			})
			// TODO This catch needed?
			.catch(error => {
				Logger.error(error);
				return Promise.reject("Login failed");
			});
	}

	/** AKA is logged in. */
	public static sessionIsAuthenticated(req: Request, res: Response, next: NextFunction): void {
		// passport.js makes sure this function is in 'req'.
		// Value comes from sent, deserialized ('passportConfig.deserializeUser') cookie.
		if (req.isAuthenticated())
			next();
		else
			next(new Error("User authentication failed"));
	}
}
