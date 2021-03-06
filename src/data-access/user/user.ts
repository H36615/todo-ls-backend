import { hash } from "bcrypt";
import { dBConfig } from "../../config/db-config";
import { IExistingUser, ILoginInformation, INewUser, userDBModel } from "../../models/user/user";
import { Logger } from "../../utils/logger/logger";

export const userFoundByEmailErrorText = "User(s) exist with given email";

/** User data access. */
export class UserDA {

	/**
	 * Get users from DB by given params.
	 */
	public static getUsersFromDB(username: string, tag?: number): Promise<IExistingUser[]> {
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

	public static getUsersFromDBByEmail(email: string): Promise<IExistingUser[]> {
		const searchObject: Pick<ILoginInformation, "email"> = { email: email };
		return dBConfig(userDBModel.table).where(searchObject);
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

		// Check that users w/ given email do not exist
		return this.getUsersFromDBByEmail(_newUser.email)
			.then((foundUsersByEmail: Array<IExistingUser>) => {
				if (foundUsersByEmail && foundUsersByEmail.length > 0)
					return Promise.reject(userFoundByEmailErrorText);

				// Deduce tag by checking existing users w/ same username.
				return this.getUsersFromDB(newUser.username);
			})
			.then((foundUsersByUsername: Array<IExistingUser>) => {
				newUser.tag = foundUsersByUsername.length > 0
					? foundUsersByUsername[foundUsersByUsername.length - 1].tag + 1
					: 0;

				// Make sure user w/ same name and tag does not exist.
				return this.getUsersFromDB(newUser.username, newUser.tag);
			})
			.then((foundUsers: Array<IExistingUser>) => {
				const rounds = 10;
				if (foundUsers.length === 0)
					return hash(newUser.password, rounds);

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
}