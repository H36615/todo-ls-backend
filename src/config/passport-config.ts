
import passportConfig from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { IExistingUser, userDBModel } from "../models/user/user";
import { Logger } from "../utils/logger/logger";
import { AuthUtils } from "../utils/auth/auth";
import { UserDA } from "../data-access/user/user";

const passportStrategies: { [key: string]: string; } = {
	login: "login",
};

passportConfig.serializeUser((user, done) => {
	// Cast to any user type to get the id property.
	done(null, (user as IExistingUser).id);
});

/** Deserialize info from cookie, and set user info to 'req' */
passportConfig.deserializeUser((userId, done) => {
	// Cast to number. The actual value is set from 'passportConfig.serializeUser'.
	UserDA.getUserFromDBByUserId(userId as number)
		.then((user: IExistingUser) => {
			done(null, user);
		})
		.catch(error => {
			Logger.error(error);
			Promise.reject(error);
		});
});

passportConfig.use(
	passportStrategies.login,
	new LocalStrategy(
		{
			// DB model is used because it's modelled after its interafce properties.
			usernameField: userDBModel.columns.email,
			passwordField: userDBModel.columns.password,
		},
		(email: string, password: string, done) => {
			AuthUtils.isAuthenticatedWithLoginInfo({ email: email, password: password })
				.then((userProperties: Pick<IExistingUser, "username" | "tag" | "id">) => {
					// Send client the selected user properties.
					return done(null, userProperties);
					// Next, should set the browser cookie through 'passportConfig.serializeUser'
					// using the argument inside done() (if session is enabled).
					// And then continue the route.
				})
				.catch(error => {
					return createError(done, error);
				});
		}
	)
);

// Passport did not provide type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createError(done: any, errorMessage: string) {
	return done(errorMessage, false);
}

export { passportConfig, passportStrategies };
