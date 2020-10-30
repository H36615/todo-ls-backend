// import { dBConfig } from "../../config/db-config";
import { IUser_IdLess, userDBModel } from "../../models/user/user";
import { hash } from "bcrypt";
import { dBConfig } from "../../config/db-config";
import { Logger } from "../logger/logger";

export class UserUtils {
	public static createNewUser(newUser: IUser_IdLess): Promise<void | number[]> {
		return hash(newUser.password, 12)
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
