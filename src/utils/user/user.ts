// import { dBConfig } from "../../config/db-config";
import { IUser_IdLess } from "../../models/user/user";


export class UserUtils {
	public static createNewUser(newUser: IUser_IdLess): Promise<void> {

		// TODO implement
		throw new Error("Not implemented");

		// return dBConfig(userDBModel.table)
		// 	.insert(newUser);
	}
}
